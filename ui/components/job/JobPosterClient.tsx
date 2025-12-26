"use client";

import { toPng } from "html-to-image";
import { useRef, useState } from "react";
import PosterRenderer from "@/ui/components/job/poster/PosterRenderer";

export default function JobPosterClient({ job }: { job: any }) {
  const posterRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);

  /* ========================
     DEVICE DETECTION
  ======================== */
  function isIOS() {
    if (typeof navigator === "undefined") return false;
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
  }

  /* ========================
     POSTER GENERATION
  ======================== */
 async function generatePoster() {
  if (!posterRef.current) return;

  // Force layout calculation
  const poster = posterRef.current;
  const finalHeight = poster.scrollHeight;

  poster.style.height = `${finalHeight}px`;

  const dataUrl = await toPng(poster, {
    pixelRatio: 2,
    quality: 1,
    cacheBust: true,
  });

  // Cleanup (important)
  poster.style.height = "auto";

  return dataUrl;
}


  /* ========================
     DOWNLOAD (ALL DEVICES)
  ======================== */
  async function downloadPoster() {
    const dataUrl = await generatePoster();
    if (!dataUrl) return;

    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `${job.slug}-udaanpath.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /* ========================
     COPY (NON-iOS ONLY)
  ======================== */
  async function copyPoster() {
    const dataUrl = await generatePoster();
    if (!dataUrl) return;

    try {
      const blob = await (await fetch(dataUrl)).blob();

      if (
        navigator.clipboard &&
        typeof ClipboardItem !== "undefined"
      ) {
        await navigator.clipboard.write([
          new ClipboardItem({ [blob.type]: blob }),
        ]);
        alert("Poster copied to clipboard ✅");
      }
    } catch (err) {
      console.warn("Copy not supported", err);
    }
  }

  /* ========================
     SHARE (NON-iOS ONLY)
  ======================== */
  async function sharePoster() {
    const dataUrl = await generatePoster();
    if (!dataUrl) return;

    try {
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File(
        [blob],
        `${job.slug}-udaanpath.png`,
        { type: "image/png" }
      );

      if (navigator.share) {
        await navigator.share({
          title: job.title,
          text: "UdaanPath – Latest Sarkari Job",
          files: [file],
        });
      }
    } catch (err) {
      console.warn("Share not supported", err);
    }
  }

  /* ========================
     UI
  ======================== */
  const isiPhone = isIOS();

  return (
    <>
      {/* ===== ACTION BUTTONS ===== */}
      <div className="flex flex-wrap gap-3">

        {/* Download → Always visible */}
        <button
          onClick={downloadPoster}
          disabled={loading}
          className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm disabled:opacity-60"
        >
          {loading ? "Generating..." : "📥 Download Poster"}
        </button>

        {/* Copy → NOT for iPhone */}
        {!isiPhone && (
          <button
            onClick={copyPoster}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white text-sm disabled:opacity-60"
          >
            {loading ? "Generating..." : "📋 Copy Poster"}
          </button>
        )}

        {/* Share → NOT for iPhone */}
        {!isiPhone && (
          <button
            onClick={sharePoster}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-green-600 text-white text-sm disabled:opacity-60"
          >
            {loading ? "Generating..." : "📤 Share Poster"}
          </button>
        )}

      </div>

      {/* ===== iPhone Helper Text ===== */}
      {isiPhone && (
        <p className="mt-2 text-xs text-slate-500">
          iPhone users: Download poster, then use Share from Photos app.
        </p>
      )}

      {/* ===== HIDDEN POSTER RENDER ===== */}
      <div
        aria-hidden
        className="fixed inset-0 pointer-events-none opacity-0"
      >
        <div
          ref={posterRef}
          style={{
            width: "1080px",
            minHeight: "1350px",
            height: "auto"
          }}
        >
          <PosterRenderer job={job} />
        </div>
      </div>
    </>
  );
}
