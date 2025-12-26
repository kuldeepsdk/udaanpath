"use server";

import { sendEmail } from "@/lib/mailer";

export async function testZohoSMTP() {
  await sendEmail({
    to: "kuldeepkumawatmail@gmail.com",
    subject: "Zoho SMTP FINAL CONFIRM",
    html: "<h1>If you see this, Zoho SMTP is working ✅</h1>",
  });
}
