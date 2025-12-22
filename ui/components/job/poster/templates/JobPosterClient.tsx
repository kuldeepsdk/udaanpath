"use client";

import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import PosterRenderer from "@/ui/components/job/poster/PosterRenderer";

export default function JobPosterClient({ job }: { job: any }) {
  const posterRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);

  const generatePosterPng = async () => {
    if (!posterRef.current) return null;

    setLoading(true);
    try {
      // ensure images/fonts render properly
      const dataUrl = await toPng(posterRef.current, {
        pixelRatio: 2,
        cacheBust: true,
        quality: 1,
      });
      return dataUrl;
    } finally {
      setLoading(false);
    }
  };

  const downloadPoster = async () => {
    const dataUrl = await generatePosterPng();
    if (!dataUrl) return;

    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `${job?.slug || "udaanpath-job"}-poster.png`;
    a.click();
  };

  const copyPoster = async () => {
    const dataUrl = await generatePosterPng();
    if (!dataUrl) return;

    const blob = await (await fetch(dataUrl)).blob();
    await navigator.clipboard.write([
      new ClipboardItem({ [blob.type]: blob }),
    ]);

    alert("✅ Poster copied to clipboard");
  };

  return (
    <>
      {/* Actions */}
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

      {/* Hidden poster render (needed for html-to-image) */}
      <div
        aria-hidden
        className="fixed inset-0 pointer-events-none opacity-0"
      >
        <div ref={posterRef}>
          <PosterRenderer job={job} />
        </div>
      </div>
    </>
  );
}
