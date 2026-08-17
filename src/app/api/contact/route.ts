import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { contactSchema } from "@/lib/validations";
import { requireAdmin } from "@/lib/require-admin";
import { sendContactEmail } from "@/lib/mailer";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  // Save to database first so no message is ever lost even if email fails
  const message = await prisma.contactMessage.create({ data: parsed.data });

  // Send email notification — errors are caught so a broken SMTP config
  // doesn't show an error to the visitor (message is already saved)
  try {
    await sendContactEmail(parsed.data);
  } catch (err) {
    console.error("[contact] Failed to send email notification:", err);
  }

  return NextResponse.json(message, { status: 201 });
}

// Admin inbox listing
export async function GET() {
  const { response } = await requireAdmin();
  if (response) return response;

  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(messages);
}
