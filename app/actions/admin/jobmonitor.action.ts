"use server";

import { cookies, headers } from "next/headers";

export async function fetchExpectedJobs({
  status = "waiting",
  limit = 50,
}: {
  status?: "waiting" | "released" | "delayed";
  limit?: number;
}) {
  const cookieStore = await cookies();
  const headerStore = await headers();

  const adminSession = cookieStore.get("admin_session")?.value;
  const adminId = cookieStore.get("admin_id")?.value;

  if (!adminSession || !adminId) {
    throw new Error("Admin session missing");
  }

  // ✅ Build absolute URL (same as Blogs)
  const host = headerStore.get("host");
  const protocol =
    process.env.NODE_ENV === "production" ? "https" : "http";

  const url = `${protocol}://${host}/api/admin/expected-jobs?status=${status}&limit=${limit}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "x-internal-token": process.env.INTERNAL_API_TOKEN!,
      "x-admin-id": adminId,
      "x-admin-session": adminSession,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("fetchExpectedJobs failed:", res.status, text);
    throw new Error("Failed to fetch expected jobs");
  }

  return res.json();
}



export async function updateExpectedJobStatus({
  id,
  action,
  notification_url,
}: {
  id: number;
  action: "release" | "delay" | "reset";
  notification_url?: string;
}) {
  const cookieStore = await cookies();
  const headerStore = await headers();

  const adminSession = cookieStore.get("admin_session")?.value;
  const adminId = cookieStore.get("admin_id")?.value;

  if (!adminSession || !adminId) {
    throw new Error("Admin session missing");
  }

  const host = headerStore.get("host");
  const protocol =
    process.env.NODE_ENV === "production" ? "https" : "http";

  const url = `${protocol}://${host}/api/admin/expected-jobs/update-status`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-internal-token": process.env.INTERNAL_API_TOKEN!,
      "x-admin-id": adminId,
      "x-admin-session": adminSession,
    },
    body: JSON.stringify({
      id,
      action,
      notification_url,
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("updateExpectedJobStatus failed:", res.status, text);
    throw new Error("Failed to update expected job");
  }

  return res.json();
}