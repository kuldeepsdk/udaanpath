"use server";

import { cookies, headers } from "next/headers";

/* ---------------------------------
   Helpers
---------------------------------- */
async function getAdminHeaders() {
  const cookieStore = await cookies();

  const adminSession = cookieStore.get("admin_session")?.value;
  const adminId = cookieStore.get("admin_id")?.value;

  if (!adminSession || !adminId) {
    throw new Error("Admin session missing");
  }

  return {
    "x-internal-token": process.env.INTERNAL_API_TOKEN!,
    "x-admin-id": adminId,
    "x-admin-session": adminSession,
    "Content-Type": "application/json",
  };
}

async function getApiBaseUrl() {
  const h = await headers();
  const host = h.get("host");

  const protocol =
    process.env.NODE_ENV === "production" ? "https" : "http";

  return `${protocol}://${host}`;
}

/* ---------------------------------
   Create Job (Vacancy)
---------------------------------- */
export async function createJobAction(payload: {
  title: string;
  slug: string;
  category: string;
  organization?: string;
  department?: string;
  summary?: string;
  full_description?: string;
  total_posts?: string;
  salary?: string;
  qualification?: string;
  age_limit?: string;
  application_fee?: string;
  selection_process?: string;
  official_website?: string;
  apply_link?: string;
  notification_image_base64?: string | null;
  published?: number;
}) {
  const baseUrl = await getApiBaseUrl();
  const adminHeaders = await getAdminHeaders();

  const res = await fetch(`${baseUrl}/api/admin/jobs`, {
    method: "POST",
    headers: adminHeaders,
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : {};

  if (!res.ok) {
    throw new Error(data.error || "Failed to create job");
  }

  return data;
}
