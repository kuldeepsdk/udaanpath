"use server";

import { cookies, headers } from "next/headers";

/* -----------------------------
   Admin auth headers for BFF
------------------------------ */
export async function getAdminHeaders(): Promise<Record<string, string>> {
  const cookieStore = await cookies();

  const adminSession = cookieStore.get("admin_session")?.value;
  const adminId = cookieStore.get("admin_id")?.value;

  if (!adminSession || !adminId) {
    throw new Error("Admin session missing");
  }

  return {
    "Content-Type": "application/json",
    "x-internal-token": process.env.INTERNAL_API_TOKEN!,
    "x-admin-id": adminId,
    "x-admin-session": adminSession,
  };
}

/* -----------------------------
   Base URL for internal fetch
------------------------------ */
export async function getApiBaseUrl(): Promise<string> {
  // Next.js 16: headers() async
  const h = await headers();

  const host = h.get("host");
  if (!host) {
    // fallback for edge cases
    return process.env.INTERNAL_API_BASE_URL || "http://localhost:3000";
  }

  const proto =
    process.env.NODE_ENV === "production" ? "https" : "http";

  return `${proto}://${host}`;
}
