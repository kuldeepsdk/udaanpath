"use server";

import { headers } from "next/headers";

const API_BASE =
  process.env.INTERNAL_API_BASE_URL || "http://localhost:3000";

export async function fetchCourseCategories() {
  const h = await headers();

  const res = await fetch(`${API_BASE}/api/course/categories`, {
    headers: {
      "x-internal-token": process.env.INTERNAL_API_TOKEN!,
    },
    cache: "force-cache",
    next: { revalidate: 3600 }, // 1 hour
  });

  if (!res.ok) {
    throw new Error("Failed to load course categories");
  }

  return res.json();
}

export async function fetchCategoryCourses(categorySlug: string) {

  console.log("Fetching category courses for slug >> :", categorySlug);
  const res = await fetch(`${API_BASE}/api/course/by-category/${categorySlug}`, {
    method: "GET",
    headers: {
      "x-internal-token": process.env.INTERNAL_API_TOKEN!,
    },
    cache: "force-cache",
    next: { revalidate: 3600 }, // 1 hour
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to load category courses: ${text}`);
  }

  return res.json();
}

export async function fetchCourseDetail(
  courseSlug: string,
  chapterUUID?: string
) {
  if (!courseSlug) {
    throw new Error("Course slug missing");
  }

  const h = await headers();

  // Build URL safely
  const url = new URL(
    `${API_BASE}/api/course/${courseSlug}`
  );

  if (chapterUUID) {
    url.searchParams.set("chapter", chapterUUID);
  }

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "x-internal-token": process.env.INTERNAL_API_TOKEN!,
    },
    cache: "force-cache",
    next: {
      revalidate: 60 * 60, // 🔥 1 hour cache
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to load course detail: ${text}`);
  }

  return res.json();
}
