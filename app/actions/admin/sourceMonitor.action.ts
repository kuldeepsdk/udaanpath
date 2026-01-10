"use server";

import { cookies, headers } from "next/headers";

async function getAdminHeaders() {
  const cookieStore = await cookies();
  const headerStore = await headers();

  const adminId = cookieStore.get("admin_id")?.value;
  const adminSession = cookieStore.get("admin_session")?.value;

  if (!adminId || !adminSession) {
    throw new Error("Admin session missing");
  }

  return {
    adminId,
    adminSession,
    host: headerStore.get("host"),
  };
}

/* ================= RUN MONITOR ================= */

export async function runSourceMonitor() {
  const { adminId, adminSession, host } =
    await getAdminHeaders();

  const protocol =
    process.env.NODE_ENV === "production" ? "https" : "http";

  const res = await fetch(
    `${protocol}://${host}/api/admin/source-monitor/run`,
    {
      method: "POST",
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
    console.error(
      "runSourceMonitor failed:",
      res.status,
      text
    );
    throw new Error("Monitor failed");
  }

  return res.json();
}

/* ================= FETCH ALERTS ================= */

export async function fetchSourceAlerts() {
  const { adminId, adminSession, host } =
    await getAdminHeaders();

  const protocol =
    process.env.NODE_ENV === "production" ? "https" : "http";

  const res = await fetch(
    `${protocol}://${host}/api/admin/source-alerts`,
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
    console.error(
      "fetchSourceAlerts failed:",
      res.status,
      text
    );
    throw new Error("Failed to load alerts");
  }

  return res.json();
}

/* ================= FETCH MONITOR STATUS ================= */

export async function getMonitorStatus() {
  const { adminId, adminSession, host } =
    await getAdminHeaders();

  const protocol =
    process.env.NODE_ENV === "production" ? "https" : "http";

  const res = await fetch(
    `${protocol}://${host}/api/admin/source-monitor/status`,
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
    console.error(
      "getMonitorStatus failed:",
      res.status,
      text
    );
    throw new Error("Status fetch failed");
  }

  return res.json();
}
