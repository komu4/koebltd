import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { contactSchema } from "@/lib/validations";
import { requireAdmin } from "@/lib/require-admin";
import nodemailer from "nodemailer";

async function sendContactEmail(data: {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}) {
  // Only attempt to send if SMTP credentials are configured
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn("[contact] SMTP not configured — skipping email notification");
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const subject = data.subject
    ? `New Contact: ${data.subject}`
    : `New Contact Message from ${data.name}`;

  await transporter.sendMail({
    from: process.env.SMTP_FROM ?? process.env.SMTP_USER,
    to: "info@koeb-admin",
    replyTo: data.email,
    subject,
    text: [
      `Name:    ${data.name}`,
      `Email:   ${data.email}`,
      `Phone:   ${data.phone ?? "—"}`,
      `Subject: ${data.subject ?? "—"}`,
      ``,
      `Message:`,
      data.message,
    ].join("\n"),
    html: `
      <h2 style="margin:0 0 16px">New contact message — KOEB</h2>
      <table cellpadding="4" cellspacing="0" style="font-family:sans-serif;font-size:14px;border-collapse:collapse">
        <tr><td style="font-weight:600;padding-right:16px">Name</td><td>${data.name}</td></tr>
        <tr><td style="font-weight:600;padding-right:16px">Email</td><td><a href="mailto:${data.email}">${data.email}</a></td></tr>
        <tr><td style="font-weight:600;padding-right:16px">Phone</td><td>${data.phone ?? "—"}</td></tr>
        <tr><td style="font-weight:600;padding-right:16px">Subject</td><td>${data.subject ?? "—"}</td></tr>
      </table>
      <h3 style="margin:24px 0 8px">Message</h3>
      <p style="font-family:sans-serif;font-size:14px;white-space:pre-wrap">${data.message}</p>
    `,
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const message = await prisma.contactMessage.create({ data: parsed.data });

  // Fire-and-forget — don't fail the request if email sending fails
  sendContactEmail(parsed.data).catch((err) =>
    console.error("[contact] Email notification failed:", err)
  );

  return NextResponse.json(message, { status: 201 });
}

// Admin inbox listing
export async function GET() {
  const { response } = await requireAdmin();
  if (response) return response;

  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(messages);
}
