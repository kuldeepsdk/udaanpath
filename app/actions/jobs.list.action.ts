// app/actions/jobs.list.action.ts
"use server";

import { headers } from "next/headers";

function buildBaseUrl(h: Headers) {
  const host = h.get("host");
  const proto =
    process.env.NODE_ENV === "production" ? "https" : "http";
  return `${proto}://${host}`;
}

export async function fetchPublicJobs({
  page = 1,
  limit = 12,
  q = "",
  category = "",
}: {
  page?: number;
  limit?: number;
  q?: string;
  category?: string;
}) {
  const h = await headers();
  const baseUrl = buildBaseUrl(h);

  const sp = new URLSearchParams();
  sp.set("page", String(page));
  sp.set("limit", String(limit));
  if (q) sp.set("q", q);
  if (category) sp.set("category", category);

  const res = await fetch(`${baseUrl}/api/jobs?${sp.toString()}`, {
    method: "GET",
    headers: {
      "x-internal-token": process.env.INTERNAL_API_TOKEN!,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to fetch jobs");
  }

  return res.json();
}
