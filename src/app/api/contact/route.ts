import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { contactSchema } from "@/lib/validations";
import { requireAdmin } from "@/lib/require-admin";
import { decryptSensitive, encryptSensitive, escapeHtml } from "@/lib/security";
import { rateLimit } from "@/lib/rate-limit";
import nodemailer from "nodemailer";

function getClientIp(req: NextRequest) {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
}

function publicMessage(message: {
  id: string; name: string; email: string; phone: string | null; subject: string | null; message: string; read: boolean; createdAt: Date;
}) {
  return {
    id: message.id,
    name: decryptSensitive(message.name),
    email: decryptSensitive(message.email),
    phone: decryptSensitive(message.phone),
    subject: decryptSensitive(message.subject),
    message: decryptSensitive(message.message),
    read: message.read,
    createdAt: message.createdAt,
  };
}

async function sendContactEmail(data: { name: string; email: string; phone?: string; subject?: string; message: string }) {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) return;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });

  const subject = data.subject ? `New Contact: ${data.subject}` : `New Contact Message from ${data.name}`;
  const safe = {
    name: escapeHtml(data.name),
    email: escapeHtml(data.email),
    phone: escapeHtml(data.phone ?? "—"),
    subject: escapeHtml(data.subject ?? "—"),
    message: escapeHtml(data.message),
  };

  await transporter.sendMail({
    from: process.env.SMTP_FROM ?? process.env.SMTP_USER,
    to: process.env.SMTP_TO ?? process.env.SMTP_USER,
    replyTo: data.email,
    subject,
    text: [`Name: ${data.name}`, `Email: ${data.email}`, `Phone: ${data.phone ?? "—"}`, `Subject: ${data.subject ?? "—"}`, "", "Message:", data.message].join("\n"),
    html: `<h2>New contact message — KOEB</h2><p><strong>Name:</strong> ${safe.name}</p><p><strong>Email:</strong> ${safe.email}</p><p><strong>Phone:</strong> ${safe.phone}</p><p><strong>Subject:</strong> ${safe.subject}</p><h3>Message</h3><p style="white-space:pre-wrap">${safe.message}</p>`,
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid contact form data" }, { status: 400 });

  if (parsed.data.website) return NextResponse.json({ success: true }, { status: 202 });

  const limiter = rateLimit(`contact:${getClientIp(req)}`, 5, 10 * 60 * 1000);
  if (!limiter.allowed) return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429, headers: { "Retry-After": String(limiter.retryAfter) } });

  const { website: _website, ...data } = parsed.data;
  if (!process.env.CONTACT_ENCRYPTION_KEY) return NextResponse.json({ error: "Service is not configured securely" }, { status: 503 });

  const encrypted = {
    name: encryptSensitive(data.name),
    email: encryptSensitive(data.email),
    phone: data.phone ? encryptSensitive(data.phone) : null,
    subject: data.subject ? encryptSensitive(data.subject) : null,
    message: encryptSensitive(data.message),
  };

  const message = await prisma.contactMessage.create({ data: encrypted });
  sendContactEmail(data).catch((err) => console.error("[contact] Email notification failed:", err));

  return NextResponse.json({ success: true, id: message.id }, { status: 201 });
}

export async function GET() {
  const { response } = await requireAdmin();
  if (response) return response;
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, email: true, phone: true, subject: true, message: true, read: true, createdAt: true },
    take: 200,
  });

  // Transparently migrate legacy plaintext contact records to encrypted storage.
  await Promise.all(messages.filter((m) => !m.name.startsWith("v1:") || !m.email.startsWith("v1:") || !m.message.startsWith("v1:")).map((m) =>
    prisma.contactMessage.update({
      where: { id: m.id },
      data: {
        name: encryptSensitive(m.name),
        email: encryptSensitive(m.email),
        phone: m.phone && !m.phone.startsWith("v1:") ? encryptSensitive(m.phone) : m.phone,
        subject: m.subject && !m.subject.startsWith("v1:") ? encryptSensitive(m.subject) : m.subject,
        message: encryptSensitive(m.message),
      },
    })
  ));

  return NextResponse.json(messages.map(publicMessage), { headers: { "Cache-Control": "private, no-store" } });
}
