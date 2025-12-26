// app\actions\ueas\ueasOrgRegister.actions.ts
"use server";

import { redirect } from "next/navigation";
import { serverFetch } from "@/lib/fetcher";

/* ================= SEND OTP ================= */

export async function sendOrgRegisterOtpAction(data: {
  org_name: string;
  org_type: string;
  city: string;
  state: string;
  admin_name: string;
  email: string;
  mobile: string;
  password: string;
}) {
  if (!data.org_name || !data.email || !data.password) {
    throw new Error("Invalid registration data");
  }

  const res = await serverFetch("/api/ueas/org/register/send-otp", {
    method: "POST",
    headers: {
      "x-internal-token": process.env.INTERNAL_API_TOKEN!,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok || !res.data?.success) {
    throw new Error(res.data?.error || "Failed to send OTP");
  }

  redirect(`/ueas/org/verify-otp?sid=${res.data.session_id}`);
}

/* ================= VERIFY OTP ================= */

export async function verifyOrgOtpAndRegisterAction(
  sessionId: string,
  otp: string
) {
  if (!sessionId || !otp) {
    throw new Error("Invalid OTP request");
  }
                                
  const res = await serverFetch("/api/ueas/org/register/verify-otp", {
    method: "POST",
    headers: {
      "x-internal-token": process.env.INTERNAL_API_TOKEN!,
    },
    body: JSON.stringify({ session_id: sessionId, otp }),
  });

  if (!res.ok || !res.data?.success) {
    throw new Error(res.data?.error || "OTP verification failed");
  }

  redirect("/ueas/org/dashboard");
}

/* ================= RESEND OTP ================= */

export async function resendOrgOtpAction(sessionId: string) {
  if (!sessionId) {
    throw new Error("Invalid session");
  }

  const res = await serverFetch("/api/ueas/org/resend-otp", {
    method: "POST",
    headers: {
      "x-internal-token": process.env.INTERNAL_API_TOKEN!,
    },
    body: JSON.stringify({ session_id: sessionId }),
  });

  if (!res.ok || !res.data?.success) {
    throw new Error(res.data?.error || "Failed to resend OTP");
  }

  return true;
}
