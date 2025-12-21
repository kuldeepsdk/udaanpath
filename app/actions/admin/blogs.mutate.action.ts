"use server";

import { cookies, headers } from "next/headers";

/* ----------------------------------
   Admin headers (session validation)
----------------------------------- */
async function getAdminHeaders() {
  const cookieStore = await cookies(); // ✅ await ONCE

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

/* ----------------------------------
   Build absolute API base URL
----------------------------------- */
async function getApiBaseUrl() {
  const h = await headers(); // ✅ must await
  const host = h.get("host");

  if (!host) {
    throw new Error("Unable to determine request host");
  }

  const protocol =
    process.env.NODE_ENV === "production" ? "https" : "http";

  return `${protocol}://${host}`;
}

/* -------------------------------
   Toggle publish status
-------------------------------- */
export async function toggleBlogStatusAction(
  blogId: string,
  published: number
) {
  const baseUrl = await getApiBaseUrl();       // ✅ await
  const adminHeaders = await getAdminHeaders(); // ✅ await

  const res = await fetch(
    `${baseUrl}/api/admin/blogs/${blogId}/status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...adminHeaders,
      },
      body: JSON.stringify({ published }),
      cache: "no-store",
    }
  );

  if (!res.ok) {
    const text = await res.text();
    console.error("toggleBlogStatusAction failed:", text);
    throw new Error("Failed to update blog status");
  }
}

/* -------------------------------
   Delete blog
-------------------------------- */
export async function deleteBlogAction(blogId: string) {
  const baseUrl = await getApiBaseUrl();        // ✅ await
  const adminHeaders = await getAdminHeaders(); // ✅ await

  const res = await fetch(
    `${baseUrl}/api/admin/blogs/${blogId}`,
    {
      method: "DELETE",
      headers: adminHeaders,
      cache: "no-store",
    }
  );

  if (!res.ok) {
    const text = await res.text();
    console.error("deleteBlogAction failed:", text);
    throw new Error("Failed to delete blog");
  }
}
