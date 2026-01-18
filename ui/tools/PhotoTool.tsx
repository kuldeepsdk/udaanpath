"use client";

import React, { useCallback, useRef, useState } from "react";
import Cropper from "react-easy-crop";
import ReactCrop, { Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

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
  { label: "SSC Photo (20KB)", w: 300, h: 400, kb: 20 },
  { label: "MP Patwari (50KB)", w: 300, h: 400, kb: 50 },
  { label: "Police (100KB)", w: 600, h: 600, kb: 100 },
  { label: "Passport (3.5×4.5)", w: 350, h: 450, kb: 50 },
  { label: "Custom", w: 300, h: 400, kb: 50, custom: true },
];

export default function PhotoTool() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  // MODE
  const [mode, setMode] = useState<"easy" | "resize">("easy");

  // easy crop
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1.2);
  const [aspect, setAspect] = useState<number | undefined>(3 / 4);

  const [croppedPixels, setCroppedPixels] = useState<any>(null);

  // resize crop
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [rcrop, setRcrop] = useState<Crop>({
    unit: "%",
    width: 60,
    height: 80,
    x: 20,
    y: 10,
  });

  const [outW, setOutW] = useState(300);
  const [outH, setOutH] = useState(400);
  const [targetKB, setTargetKB] = useState(50);

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  /* ========================= */
  const onSelectFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const dataUrl = await readFileAsDataURL(f);
    setImageSrc(dataUrl);
    setMsg("Photo uploaded. Adjust crop.");
  };

  const onCropComplete = useCallback((_a: any, b: any) => {
    setCroppedPixels(b);
  }, []);

  /* ========================= */
  const applyPreset = (p: Preset) => {
    setOutW(p.w);
    setOutH(p.h);
    setTargetKB(p.kb);

    if (p.custom) {
      setMode("resize");
      setAspect(undefined);
      setMsg("Custom mode: drag corners to resize crop area.");
    } else {
      setMode("easy");
      setAspect(p.w / p.h);
      setMsg(`${p.label} preset selected`);
    }

    setZoom(1.2);
  };

  /* ========================= */
  const download = async () => {
    if (!imageSrc) return;

    setLoading(true);
    setMsg("");

    try {
      let canvas: HTMLCanvasElement;

      if (mode === "easy") {
        canvas = await getCroppedCanvas(imageSrc, croppedPixels);
        canvas = resizeCanvas(canvas, outW, outH);
      } else {
        const img = imgRef.current!;
        const scaleX = img.naturalWidth / img.width;
        const scaleY = img.naturalHeight / img.height;

        const c = document.createElement("canvas");
        c.width = rcrop.width! * scaleX;
        c.height = rcrop.height! * scaleY;

        const ctx = c.getContext("2d")!;
        ctx.drawImage(
          img,
          rcrop.x! * scaleX,
          rcrop.y! * scaleY,
          rcrop.width! * scaleX,
          rcrop.height! * scaleY,
          0,
          0,
          c.width,
          c.height
        );

        canvas = resizeCanvas(c, outW, outH);
      }

      const { blob, sizeKB } = await compressToTargetKB({
        canvas,
        targetKB,
      });

      downloadBlob(blob, `photo-${outW}x${outH}-${targetKB}kb.jpg`);
      setMsg(`Downloaded (${sizeKB.toFixed(1)} KB)`);
    } catch (e) {
      console.error(e);
      alert("Failed to process image");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-1">Exam Photo Resize Tool</h1>
      <p className="text-sm text-gray-600 mb-4">
        Resize & crop photo for govt exam forms. Custom mode supported.
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

      {/* PREVIEW */}
      <div className="bg-gray-100 rounded-xl overflow-hidden mb-4">
        {!imageSrc ? (
          <label className="h-[360px] flex items-center justify-center cursor-pointer text-gray-500">
            <input
              type="file"
              accept="image/*"
              onChange={onSelectFile}
              className="hidden"
            />
            Tap to upload photo
          </label>
        ) : mode === "easy" ? (
          <div className="relative h-[360px]">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={aspect}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
        ) : (
          <ReactCrop crop={rcrop} onChange={(c) => setRcrop(c)}>
            <img ref={imgRef} src={imageSrc} alt="" className="max-h-[360px]" />
          </ReactCrop>
        )}
      </div>

      {/* CONTROLS */}
      <div className="bg-white p-4 rounded-xl shadow-sm">
        <div className="grid grid-cols-3 gap-3 mb-3">
          <input
            type="number"
            value={outW}
            onChange={(e) => setOutW(+e.target.value)}
            className="border rounded px-2 py-1"
            placeholder="Width"
          />
          <input
            type="number"
            value={outH}
            onChange={(e) => setOutH(+e.target.value)}
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

        {mode === "easy" && (
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
        )}

        <button
          onClick={download}
          disabled={!imageSrc || loading}
          className="w-full bg-black text-white py-3 rounded-xl font-semibold"
        >
          {loading ? "Processing..." : "Download Photo"}
        </button>

        {msg && <p className="text-green-600 text-sm mt-2">{msg}</p>}

        <p className="text-xs text-gray-500 mt-3">
          🔒 Image never leaves your device
        </p>
      </div>

      {/* SEO */}
      <div className="mt-10 text-sm text-gray-700">
        <h2 className="font-semibold mb-2">
          How to resize photo for govt exam forms?
        </h2>
        <p>
          Choose preset or custom mode, upload photo, adjust crop and download
          instantly. Works for all government exams.
        </p>
      </div>
    </div>
  );
}
