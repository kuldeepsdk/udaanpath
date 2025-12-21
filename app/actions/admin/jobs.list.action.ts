"use server";

import { cookies, headers } from "next/headers";

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
   Fetch jobs for admin panel
---------------------------------- */
export async function fetchAdminJobs({
  page = 1,
  limit = 10,
}: {
  page?: number;
  limit?: number;
}) {
  const baseUrl = await getApiBaseUrl();
  const adminHeaders = await getAdminHeaders();

  const res = await fetch(
    `${baseUrl}/api/admin/jobs?page=${page}&limit=${limit}`,
    {
      method: "GET",
      headers: adminHeaders,
      cache: "no-store",
    }
  );

  if (!res.ok) {
    const text = await res.text();
    console.error("fetchAdminJobs failed:", text);
    throw new Error(text || "Failed to fetch jobs");
  }

  return res.json();
}
