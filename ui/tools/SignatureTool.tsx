"use client";

import React, { useCallback, useState } from "react";
import Cropper from "react-easy-crop";
import {
  readFileAsDataURL,
  getCroppedCanvas,
  resizeCanvas,
  compressToTargetKB,
  downloadBlob,
} from "@/lib/imageTools";

type Preset = {
  label: string;
  w: number;
  h: number;
  kb: number;
  custom?: boolean;
};

const PRESETS: Preset[] = [
  { label: "SSC (10KB)", w: 300, h: 100, kb: 10 },
  { label: "MP Exam (20KB)", w: 300, h: 100, kb: 20 },
  { label: "Police (30KB)", w: 400, h: 120, kb: 30 },
  { label: "Custom", w: 300, h: 100, kb: 20, custom: true },
];

export default function SignatureTool() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1.3);

  // 🔧 FIX: allow undefined
  const [aspect, setAspect] = useState<number | undefined>(3);

  const [croppedPixels, setCroppedPixels] = useState<any>(null);

  const [outW, setOutW] = useState(300);
  const [outH, setOutH] = useState(100);
  const [targetKB, setTargetKB] = useState(20);
  const [isCustom, setIsCustom] = useState(false);

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  /* ===============================
     Crop complete
  =============================== */
  const onCropComplete = useCallback((_a: any, b: any) => {
    setCroppedPixels(b);
  }, []);

  /* ===============================
     File upload
  =============================== */
  const onSelectFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const dataUrl = await readFileAsDataURL(f);
    setImageSrc(dataUrl);
    setMsg("Signature uploaded. Adjust crop if needed.");
  };

  /* ===============================
     Preset logic
  =============================== */
  const applyPreset = (p: Preset) => {
    setOutW(p.w);
    setOutH(p.h);
    setTargetKB(p.kb);

    if (p.custom) {
      setIsCustom(true);
      setAspect(p.w / p.h);
      setMsg("Custom mode enabled. Preview updates live.");
    } else {
      setIsCustom(false);
      setAspect(p.w / p.h);
      setMsg(`${p.label} preset selected`);
    }

    setZoom(1.3);
  };

  /* ===============================
     Download
  =============================== */
  const download = async () => {
    if (!imageSrc || !croppedPixels) {
      alert("Please upload and crop your signature first");
      return;
    }

    setLoading(true);
    setMsg("");

    try {
      const cropped = await getCroppedCanvas(imageSrc, croppedPixels);
      const resized = resizeCanvas(cropped, outW, outH);
      const { blob, sizeKB } = await compressToTargetKB({
        canvas: resized,
        targetKB,
      });

      downloadBlob(blob, `signature-${outW}x${outH}-${targetKB}kb.jpg`);
      setMsg(`Downloaded successfully (${sizeKB.toFixed(1)} KB)`);
    } catch (err) {
      console.error(err);
      alert("Signature processing failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-1">Signature Resize Tool</h1>
      <p className="text-sm text-gray-600 mb-4">
        Resize signature for SSC, MP, Police, UPSC & all government exam forms.
      </p>

      {/* PRESETS */}
      <div className="flex flex-wrap gap-2 mb-4">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            onClick={() => applyPreset(p)}
            className="px-3 py-1 border rounded-full text-sm bg-white hover:bg-black hover:text-white transition"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* MAIN LAYOUT */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* PREVIEW */}
        <div className="bg-gray-100 rounded-xl overflow-hidden">
          {!imageSrc ? (
            <label className="h-[220px] flex items-center justify-center cursor-pointer text-gray-500">
              <input
                type="file"
                accept="image/*"
                onChange={onSelectFile}
                className="hidden"
              />
              Upload signature image
            </label>
          ) : (
            <div className="relative h-[220px]">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={aspect}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
                objectFit="contain"
              />
            </div>
          )}
        </div>

        {/* CONTROLS */}
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <div className="grid grid-cols-3 gap-3 mb-2">
            <input
              type="number"
              value={outW}
              onChange={(e) => {
                const w = +e.target.value;
                setOutW(w);
                if (isCustom && outH > 0) {
                  setAspect(w / outH);
                }
              }}
              className="border rounded px-2 py-1"
              placeholder="Width"
            />

            <input
              type="number"
              value={outH}
              onChange={(e) => {
                const h = +e.target.value;
                setOutH(h);
                if (isCustom && h > 0) {
                  setAspect(outW / h);
                }
              }}
              className="border rounded px-2 py-1"
              placeholder="Height"
            />

            <input
              type="number"
              value={targetKB}
              onChange={(e) => setTargetKB(+e.target.value)}
              className="border rounded px-2 py-1"
              placeholder="KB"
            />
          </div>

          {isCustom && (
            <p className="text-xs text-blue-600 mb-2">
              Custom mode: preview updates live as you change size
            </p>
          )}

          <div className="mb-3">
            <label className="text-sm font-medium">Zoom</label>
            <input
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={zoom}
              onChange={(e) => setZoom(+e.target.value)}
              className="w-full"
            />
          </div>

          <button
            onClick={download}
            disabled={!imageSrc || loading}
            className="w-full bg-black text-white py-3 rounded-xl font-semibold"
          >
            {loading ? "Processing..." : "Download Signature"}
          </button>

          {msg && <p className="text-green-600 text-sm mt-2">{msg}</p>}

          <p className="text-xs text-gray-500 mt-3">
            🔒 Your signature is processed locally in your browser
          </p>
        </div>
      </div>

      {/* SEO */}
      <div className="mt-10 text-sm text-gray-700">
        <h2 className="font-semibold mb-2">
          How to resize signature for govt exam forms?
        </h2>
        <p>
          Select preset (10KB / 20KB / 30KB) or use custom mode, upload signature,
          adjust crop and download instantly. 100% free.
        </p>
      </div>
    </div>
  );
}
