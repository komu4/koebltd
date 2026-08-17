import nodemailer from "nodemailer";

// Configure your SMTP credentials in .env:
//   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM
// If those are not set the mailer silently skips sending (so dev works without email).

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 465,
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendContactEmail(data: {
  name: string;
  email: string;
  phone?: string | null;
  subject?: string | null;
  message: string;
}) {
  // Skip silently if SMTP credentials are not configured
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn("[mailer] SMTP_USER/SMTP_PASS not set — email not sent.");
    return;
  }

  const to = process.env.CONTACT_EMAIL_TO || "info@koebltd.com";
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;
  const subjectLine = data.subject
    ? `[KOEB Contact] ${data.subject}`
    : `[KOEB Contact] New message from ${data.name}`;

  await transporter.sendMail({
    from: `"KOEB Website" <${from}>`,
    to,
    replyTo: `"${data.name}" <${data.email}>`,
    subject: subjectLine,
    text: [
      `Name:    ${data.name}`,
      `Email:   ${data.email}`,
      `Phone:   ${data.phone || "—"}`,
      `Subject: ${data.subject || "—"}`,
      ``,
      data.message,
    ].join("\n"),
    html: `
      <table style="font-family:sans-serif;font-size:14px;color:#333;max-width:560px">
        <tr><td style="padding:4px 0"><strong>Name:</strong> ${data.name}</td></tr>
        <tr><td style="padding:4px 0"><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></td></tr>
        <tr><td style="padding:4px 0"><strong>Phone:</strong> ${data.phone || "—"}</td></tr>
        <tr><td style="padding:4px 0"><strong>Subject:</strong> ${data.subject || "—"}</td></tr>
        <tr><td style="padding:16px 0 4px"><strong>Message:</strong></td></tr>
        <tr><td style="white-space:pre-wrap;background:#f7f7f7;padding:12px;border-radius:6px">${data.message}</td></tr>
      </table>
    `,
  });
}
