"use server";

import { serverFetch } from "@/lib/fetcher";

export async function getBlogs(page: number) {
  return serverFetch(`/api/blogs?page=${page}`, {
    cache: "no-store",
    headers: {
      "x-internal-token": process.env.INTERNAL_API_TOKEN!,
    },
  });
}


export async function getBlogBySlug(slug: string) {
  return serverFetch(`/api/blogs/${slug}`, {
    cache: "no-store",
    headers: {
      "x-internal-token": process.env.INTERNAL_API_TOKEN!,
    },
  });
}