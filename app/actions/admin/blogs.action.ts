"use server";

import { cookies, headers } from "next/headers";

export async function fetchAdminBlogs({
  page = 1,
  limit = 10,
}: {
  page?: number;
  limit?: number;
}) {
  const cookieStore = await cookies();
  const headerStore = await headers();

  const adminSession = cookieStore.get("admin_session")?.value;
  const adminId = cookieStore.get("admin_id")?.value;

  if (!adminSession || !adminId) {
    throw new Error("Admin session missing");
  }

  // ✅ Build absolute URL (CRITICAL FIX)
  const host = headerStore.get("host");
  const protocol =
    process.env.NODE_ENV === "production" ? "https" : "http";

  const url = `${protocol}://${host}/api/admin/blogs?page=${page}&limit=${limit}`;

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
    console.error("fetchAdminBlogs failed:", res.status, text);
    throw new Error("Failed to fetch blogs");
  }

  return res.json();
}
