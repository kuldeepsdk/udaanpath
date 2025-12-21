"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { CalendarDays, Share2, Copy, Check } from "lucide-react";
import { getBlogBySlug } from "@/app/actions/blogs.actions";

interface Blog {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  image_base64: string;
  created_at: string;
}

export default function BlogDetail() {
  const params = useParams();
  const slug = params.slug as string;

  const [blog, setBlog] = useState<Blog | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!slug) return;
    async function loadBlog() {
      try {
        const data = await getBlogBySlug(slug);
        setBlog(data);
      } catch {
        setBlog(null);
      }
    }

    loadBlog();
  }, [slug]);

  if (!blog) {
    return (
      <div className="py-32 text-center text-slate-500 text-lg">
        Loading article...
      </div>
    );
  }

  /* 🔹 Dynamic share message */
  const shareMessage = `📖 ${blog.title}

${blog.summary}

Read full article on UdaanPath 👇`;

  async function handleShare() {
    if (!blog) return;
    const url = window.location.href;

    if (navigator.share) {
      await navigator.share({
        title: blog.title,
        text: shareMessage,
        url,
      });
    } else {
      await navigator.clipboard.writeText(`${shareMessage}\n${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:py-10">

      {/* HERO IMAGE */}
      <div className="rounded-2xl overflow-hidden shadow-xl mb-8 sm:mb-10">
        <img
          src={`data:image/jpeg;base64,${blog.image_base64}`}
          className="w-full h-[240px] sm:h-[360px] lg:h-[420px] object-cover"
          alt={blog.title}
        />
      </div>

      {/* TITLE + META */}
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-5 mb-10 sm:mb-12">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight text-slate-900">
          {blog.title}
        </h1>

        <p className="text-base sm:text-lg text-slate-600">
          {blog.summary}
        </p>

        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4" />
            {new Date(blog.created_at).toLocaleDateString()}
          </div>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-blue-600 border-blue-200 hover:bg-blue-50 hover:border-blue-400 transition"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-green-600" />
                Copied
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                Share
              </>
            )}
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <article
        className="
          prose 
          prose-slate 
          prose-lg
          max-w-7xl 
          mx-auto 
          text-slate-900
          prose-headings:font-semibold
          prose-a:text-blue-600
          prose-img:rounded-xl
        "
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />

      {/* SEARCH MORE BLOGS CTA */}
        <div className="mt-16 border-t pt-10 text-center">
        <p className="text-slate-600 text-sm mb-4">
            Looking for more articles like this?
        </p>

        <a
            href="/blogs"
            className="
            inline-flex items-center gap-2
            rounded-full
            border border-blue-200
            px-6 py-2.5
            text-blue-600
            font-medium
            hover:bg-blue-50
            hover:border-blue-400
            transition
            "
        >
            🔍 Search more blogs
        </a>
        </div>

    </div>
  );
}
