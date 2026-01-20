"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { getBlogs } from "@/app/actions/blogs.actions";

interface BlogItem {
  id: number;
  title: string;
  slug: string;
  summary: string;
  image_base64: string;
  created_at: string;
}

/** ✅ Handles: URL OR data-uri OR raw base64 */
function resolveImageSrc(value?: string) {
  if (!value) return "";

  // URL
  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }

  // data uri already
  if (value.startsWith("data:image")) {
    return value;
  }

  // raw base64
  return `data:image/jpeg;base64,${value}`;
}

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  async function loadBlogs(p: number) {
    setLoading(true);
    const data = await getBlogs(p);
    setBlogs(data.data.blogs);
    setTotalPages(data.data.totalPages);
    setPage(data.data.page);
    setLoading(false);
  }

  useEffect(() => {
    loadBlogs(page);
  }, [page]);

  if (loading) {
    return (
      <div className="flex justify-center py-32">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  if (blogs.length === 0) {
    return <div className="text-center py-40 text-slate-500">No blogs found</div>;
  }

  const featured = blogs[0];
  const mediumPosts = blogs.slice(1, 3);
  const gridPosts = blogs.slice(3);

  // Optional: you can set your placeholder (recommended)
  const FALLBACK_IMAGE = "/images/blog-placeholder.jpg";

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Featured */}
      <Link
        href={`/blogs/${featured.slug}`}
        className="block relative rounded-2xl overflow-hidden shadow-xl group mb-10"
      >
        <img
          src={resolveImageSrc(featured.image_base64) || FALLBACK_IMAGE}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = FALLBACK_IMAGE;
          }}
          className="w-full h-[420px] object-cover group-hover:scale-105 transition-transform duration-500"
          alt={featured.title}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-6 left-6 text-white space-y-3">
          <h2 className="text-3xl font-bold leading-tight group-hover:underline">
            {featured.title}
          </h2>
          <p className="max-w-2xl text-white/90 line-clamp-2">{featured.summary}</p>
        </div>
      </Link>

      {/* Medium */}
      <div className="grid md:grid-cols-2 gap-8 mb-10">
        {mediumPosts.map((post) => (
          <Link
            key={post.id}
            href={`/blogs/${post.slug}`}
            className="flex gap-4 p-4 rounded-xl border bg-white shadow hover:shadow-lg transition"
          >
            <img
              src={resolveImageSrc(post.image_base64) || FALLBACK_IMAGE}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = FALLBACK_IMAGE;
              }}
              className="w-40 h-32 object-cover rounded-md"
              alt={post.title}
              loading="lazy"
            />
            <div className="flex flex-col justify-between">
              <h3 className="text-lg font-semibold text-slate-900 line-clamp-2">
                {post.title}
              </h3>
              <p className="text-slate-600 text-sm line-clamp-3">{post.summary}</p>
              <span className="text-xs text-slate-400">
                {new Date(post.created_at).toLocaleDateString()}
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {gridPosts.map((post) => (
          <Link
            key={post.id}
            href={`/blogs/${post.slug}`}
            className="rounded-xl border bg-white shadow hover:border-blue-600 hover:shadow-xl transition overflow-hidden group"
          >
            <img
              src={resolveImageSrc(post.image_base64) || FALLBACK_IMAGE}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = FALLBACK_IMAGE;
              }}
              className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
              alt={post.title}
              loading="lazy"
            />
            <div className="p-5 space-y-2">
              <h3 className="text-lg font-semibold text-slate-900 line-clamp-2 group-hover:text-blue-700">
                {post.title}
              </h3>
              <p className="text-slate-600 text-sm line-clamp-3">{post.summary}</p>
              <span className="text-xs text-slate-400 block">
                {new Date(post.created_at).toLocaleDateString()}
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-14">
        <button
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
          className="px-4 py-2 border rounded disabled:opacity-40"
        >
          Previous
        </button>

        <span className="text-sm font-medium text-slate-600">
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page >= totalPages}
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 border rounded disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}
