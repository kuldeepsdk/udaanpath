// lib\mailer.ts

import nodemailer from "nodemailer";

export interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail({
  to,
  subject,
  html,
  text,
}: SendEmailParams): Promise<void> {

  // 🔒 Server-only safeguard
  if (typeof window !== "undefined") {
    throw new Error("sendEmail can only be called on server");
  }

  const {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_SECURE,
    SMTP_USER,
    SMTP_PASS,
    MAIL_FROM_NAME,
    MAIL_FROM_EMAIL,
  } = process.env;

  if (
    !SMTP_HOST ||
    !SMTP_PORT ||
    !SMTP_USER ||
    !SMTP_PASS ||
    !MAIL_FROM_EMAIL
  ) {
    throw new Error("SMTP environment variables are missing");
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: SMTP_SECURE === "true", // Zoho: false for 587
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
    authMethod: "LOGIN", // 🔑 important for Zoho
    tls: {
      rejectUnauthorized: false, // 🔑 prevents TLS handshake issues
    },
  });

  await transporter.sendMail({
    from: `"${MAIL_FROM_NAME || "UdaanPath"}" <${MAIL_FROM_EMAIL}>`,
    to,
    subject,
    html,
    text,
  });
}
