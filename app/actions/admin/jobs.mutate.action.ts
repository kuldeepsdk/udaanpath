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
   Toggle publish status
---------------------------------- */
export async function toggleJobStatusAction(
  jobId: string,
  published: number
) {
  const baseUrl = await getApiBaseUrl();
  const adminHeaders = await getAdminHeaders();

  const res = await fetch(
    `${baseUrl}/api/admin/jobs/${jobId}/status`,
    {
      method: "PATCH",
      headers: adminHeaders,
      body: JSON.stringify({ published }),
      cache: "no-store",
    }
  );

  if (!res.ok) {
    const text = await res.text();
    console.error("toggleJobStatusAction failed:", text);
    throw new Error("Failed to update job status");
  }
}

/* ---------------------------------
   Delete job
---------------------------------- */
export async function deleteJobAction(jobId: string) {
  const baseUrl = await getApiBaseUrl();
  const adminHeaders = await getAdminHeaders();

  const res = await fetch(
    `${baseUrl}/api/admin/jobs/${jobId}`,
    {
      method: "DELETE",
      headers: adminHeaders,
      cache: "no-store",
    }
  );

  if (!res.ok) {
    const text = await res.text();
    console.error("deleteJobAction failed:", text);
    throw new Error("Failed to delete job");
  }
}
