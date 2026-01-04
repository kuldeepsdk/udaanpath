"use server";

import {
  getApiBaseUrl,
  getAdminHeaders,
} from "@/app/actions/admin/_helpers";

export async function getAdminDashboardAction() {
  const res = await fetch(
    `${await getApiBaseUrl()}/api/admin/dashboard`,
    {
      method: "GET",
      headers: await getAdminHeaders(),
      cache: "no-store",
    }
  );

  // 🔥 SAFETY NET
  const text = await res.text();

  if (!text) {
    console.error("Dashboard API returned empty body");
    throw new Error("Empty API response");
  }

  let data: any;
  try {
    data = JSON.parse(text);
  } catch (err) {
    console.error("Invalid JSON:", text);
    throw new Error("Invalid dashboard API response");
  }

  if (!res.ok || !data?.success) {
    console.error("Dashboard API failed:", data);
    throw new Error(data?.error || "Failed to load dashboard");
  }

  return data;
}
