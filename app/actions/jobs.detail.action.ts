"use server";

import { headers } from "next/headers";

async function getApiBaseUrl() {
  const h = await headers();
  const host = h.get("host");
  const protocol =
    process.env.NODE_ENV === "production" ? "https" : "http";
  return `${protocol}://${host}`;
}

export async function fetchJobDetail(slug: string) {
  const res = await fetch(
    `${await getApiBaseUrl()}/api/jobs/${slug}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
     return null;
  }

  return res.json();
}
