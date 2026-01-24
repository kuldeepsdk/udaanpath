// NO "use client"

export async function getBlogBySlugServer(slug: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/blogs/${slug}`,
    { cache: "no-store" }
  );

  if (!res.ok) return null;
  return res.json();
}
