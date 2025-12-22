"use client";

import { toPng } from "html-to-image";
import { useRef, useState } from "react";
import PosterRenderer from "@/ui/components/job/poster/PosterRenderer";

export default function JobPosterClient({ job }: { job: any }) {
  const posterRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);

  async function generatePoster() {
    if (!posterRef.current) return null;
    setLoading(true);

    try {
      const dataUrl = await toPng(posterRef.current, {
        pixelRatio: 2,
        quality: 1,
        cacheBust: true,
      });
      return dataUrl;
    } finally {
      setLoading(false);
    }
  }

  async function downloadPoster() {
    const dataUrl = await generatePoster();
    if (!dataUrl) return;

    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `${job.slug}-udaanpath.png`;
    link.click();
  }

  async function copyPoster() {
    const dataUrl = await generatePoster();
    if (!dataUrl) return;

    const blob = await (await fetch(dataUrl)).blob();
    await navigator.clipboard.write([
      new ClipboardItem({ [blob.type]: blob }),
    ]);

    alert("Poster copied to clipboard ✅");
  }

  return (
    <>
      {/* ===== Buttons ===== */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={downloadPoster}
          disabled={loading}
          className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm disabled:opacity-60"
        >
          {loading ? "Generating..." : "📥 Download Poster"}
        </button>

        <button
          onClick={copyPoster}
          disabled={loading}
          className="px-4 py-2 rounded-xl bg-slate-900 text-white text-sm disabled:opacity-60"
        >
          {loading ? "Generating..." : "📋 Copy Poster"}
        </button>
      </div>

      {/* ===== HIDDEN POSTER (THIS IS KEY) ===== */}
      <div
        aria-hidden
        className="fixed inset-0 pointer-events-none opacity-0"
      >
        <div ref={posterRef}>
          {/* 🔥 THIS decides the design */}
          <PosterRenderer job={job} />
        </div>
      </div>
    </>
  );
}
