"use server";

import { cookies, headers } from "next/headers";

/* ---------------------------------
   Admin headers (shared)
---------------------------------- */
async function getAdminHeaders(): Promise<Record<string, string>> {
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

/* ---------------------------------
   API base URL (Next 16 safe)
---------------------------------- */
async function getApiBaseUrl(): Promise<string> {
  const h = await headers();
  const host = h.get("host");

  if (!host) {
    throw new Error("Unable to resolve host");
  }

  const protocol =
    process.env.NODE_ENV === "production" ? "https" : "http";

  return `${protocol}://${host}`;
}

/* ---------------------------------
   Fetch job (edit page)
---------------------------------- */
export async function fetchAdminJob(jobId: string) {
  if (!jobId) {
    throw new Error("Job ID is required");
  }

  const res = await fetch(
    `${await getApiBaseUrl()}/api/admin/jobs/${jobId}`,
    {
      method: "GET",
      headers: await getAdminHeaders(),
      cache: "no-store",
    }
  );

  if (!res.ok) {
    const text = await res.text();
    console.error("fetchAdminJob failed:", text);
    throw new Error("Failed to load job");
  }

  return res.json();
}

/* ---------------------------------
   Update job
---------------------------------- */
export async function updateJobAction(
  jobId: string,
  payload: Record<string, any>
) {
  if (!jobId) {
    throw new Error("Job ID is required");
  }

  const res = await fetch(
    `${await getApiBaseUrl()}/api/admin/jobs/${jobId}`,
    {
      method: "PUT",
      headers: {
        ...(await getAdminHeaders()),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    }
  );

  if (!res.ok) {
    const text = await res.text();
    console.error("updateJobAction failed:", text);
    throw new Error(text || "Failed to update job");
  }

  return res.json();
}
