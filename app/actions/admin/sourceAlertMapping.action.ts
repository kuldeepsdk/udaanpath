"use server";

import { cookies, headers } from "next/headers";

async function getAdminAuth() {
  const cookieStore = await cookies();
  const headerStore = await headers();

  const adminId = cookieStore.get("admin_id")?.value;
  const adminSession = cookieStore.get("admin_session")?.value;

  if (!adminId || !adminSession) {
    throw new Error("Admin session missing");
  }

  const protocol =
    process.env.NODE_ENV === "production" ? "https" : "http";

  const host = headerStore.get("host");

  return {
    adminId,
    adminSession,
    baseUrl: `${protocol}://${host}`,
  };
}

export async function fetchExpectedJobsForAlert(alertId: number) {
  const { adminId, adminSession, baseUrl } =
    await getAdminAuth();

  const res = await fetch(
    `${baseUrl}/api/admin/source-alerts/${alertId}/expected-jobs`,
    {
      headers: {
        "x-internal-token": process.env.INTERNAL_API_TOKEN!,
        "x-admin-id": adminId,
        "x-admin-session": adminSession,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    const text = await res.text();
    console.error(text);
    throw new Error("Failed to load expected jobs");
  }

  return res.json();
}

export async function mapAlertToExpectedJob(
  alertId: number,
  jobId: number
) {
  const { adminId, adminSession, baseUrl } =
    await getAdminAuth();

  const res = await fetch(
    `${baseUrl}/api/admin/source-alerts/${alertId}/map`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-internal-token": process.env.INTERNAL_API_TOKEN!,
        "x-admin-id": adminId,
        "x-admin-session": adminSession,
      },
      body: JSON.stringify({ job_id: jobId }),
      cache: "no-store",
    }
  );

  if (!res.ok) {
    const text = await res.text();
    console.error(text);
    throw new Error("Mapping failed");
  }

  return res.json();
}
