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

export async function createBlogAction(payload: {
  title: string;
  slug: string;
  summary?: string;
  content_html: string;
  image_base64?: string | null;
  published?: number;
}) {
  const res = await fetch(
    `${await getApiBaseUrl()}/api/admin/blogs/new`,
    {
      method: "POST",
      headers: await getAdminHeaders(),
      body: JSON.stringify(payload),
      cache: "no-store",
    }
  );

  const text = await res.text();
  const data = text ? JSON.parse(text) : {};

  if (!res.ok) {
    throw new Error(data.error || "Failed to create blog");
  }

  return data;
}
