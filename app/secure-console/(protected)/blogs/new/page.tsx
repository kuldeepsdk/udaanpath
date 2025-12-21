"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createBlogAction } from "@/app/actions/admin/blogs.create.action";

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-");
}

export default function NewBlogPage() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const [autoSlug, setAutoSlug] = useState(true);
  const [imageBase64, setImageBase64] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: "",
    slug: "",
    summary: "",
    content_html: "",
    published: 0,
  });

  /* ----------------------------
     Auto slug
  ----------------------------- */
  useEffect(() => {
    if (autoSlug) {
      setForm((f) => ({ ...f, slug: slugify(f.title) }));
    }
  }, [form.title, autoSlug]);

  const previewHtml = useMemo(
    () => form.content_html,
    [form.content_html]
  );

  /* ----------------------------
     Image → Base64
  ----------------------------- */
  function handleImageUpload(file: File) {
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="max-w-6xl space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">
            New Blog
          </h1>
          <p className="text-sm text-slate-500">
            Paste HTML and preview live.
          </p>
        </div>

        <button
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              await createBlogAction({
                title: form.title,
                slug: form.slug,
                summary: form.summary,
                content_html: form.content_html,
                image_base64: imageBase64,
                published: form.published,
              });

              // ✅ push is async; use replace so it navigates and reloads fresh data
              router.replace("/secure-console/blogs?page=1");
              // ❌ router.refresh() not needed here
            })
          }
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-60"
        >
          {pending ? "Saving..." : "Save Blog"}
        </button>

      </div>

      {/* Title + Slug */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="text-sm font-medium text-slate-700">
            Title
          </label>
          <input
            className="w-full mt-1 border rounded-lg px-3 py-2"
            value={form.title}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
          />
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-slate-700">
              Slug
            </label>
            <label className="text-xs flex items-center gap-2 text-slate-500">
              <input
                type="checkbox"
                checked={autoSlug}
                onChange={() => setAutoSlug((v) => !v)}
              />
              Auto-generate
            </label>
          </div>

          <input
            className="w-full mt-1 border rounded-lg px-3 py-2 font-mono text-sm"
            value={form.slug}
            onChange={(e) => {
              setAutoSlug(false);
              setForm({ ...form, slug: e.target.value });
            }}
          />
        </div>
      </div>

      {/* Image Upload */}
      <div>
        <label className="text-sm font-medium text-slate-700">
          Featured Image
        </label>
        <input
          type="file"
          accept="image/*"
          className="block mt-1 text-sm"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleImageUpload(file);
          }}
        />

        {imageBase64 && (
          <img
            src={imageBase64}
            alt="Preview"
            className="mt-3 max-h-48 rounded border"
          />
        )}
      </div>

      {/* Summary */}
      <div>
        <label className="text-sm font-medium text-slate-700">
          Summary
        </label>
        <textarea
          className="w-full mt-1 border rounded-lg px-3 py-2"
          rows={3}
          value={form.summary}
          onChange={(e) =>
            setForm({ ...form, summary: e.target.value })
          }
        />
      </div>

      {/* Published */}
      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input
          type="checkbox"
          checked={form.published === 1}
          onChange={(e) =>
            setForm({
              ...form,
              published: e.target.checked ? 1 : 0,
            })
          }
        />
        Publish immediately
      </label>

      {/* Editor + Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* HTML Editor */}
        <div className="bg-white border rounded-xl p-4 shadow-sm">
          <textarea
            className="w-full min-h-[420px] border rounded-lg px-3 py-2 font-mono text-xs"
            value={form.content_html}
            onChange={(e) =>
              setForm({ ...form, content_html: e.target.value })
            }
          />
        </div>

        {/* Preview */}
        <div className="bg-white border rounded-xl p-4 shadow-sm">
          <div className="min-h-[420px] border rounded-lg p-4 overflow-auto">
            {previewHtml ? (
              <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
            ) : (
              <div className="text-sm text-slate-400">
                HTML preview will appear here
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
