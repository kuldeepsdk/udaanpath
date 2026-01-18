"use client";

import React, { useCallback, useRef, useState } from "react";
import Cropper from "react-easy-crop";
import ReactCrop, { Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

import {
  readFileAsDataURL,
  getCroppedCanvas,
  downloadBlob,
} from "@/lib/imageTools";

type AspectPreset = {
  label: string;
  value?: number;
};

const ASPECTS: AspectPreset[] = [
  { label: "Free" },
  { label: "1:1", value: 1 },
  { label: "3:4", value: 3 / 4 },
  { label: "4:3", value: 4 / 3 },
  { label: "16:9", value: 16 / 9 },
  { label: "Passport", value: 3.5 / 4.5 },
];

export default function ImageCropTool() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  // modes
  const [mode, setMode] = useState<"easy" | "resize">("easy");

  // easy crop
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1.2);
  const [aspect, setAspect] = useState<number | undefined>(undefined);
  const [croppedPixels, setCroppedPixels] = useState<any>(null);

  // resize crop
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [rcrop, setRcrop] = useState<Crop>({
    unit: "%",
    width: 60,
    height: 60,
    x: 20,
    y: 20,
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  /* ========================= */
  const onSelectFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const dataUrl = await readFileAsDataURL(f);
    setImageSrc(dataUrl);
    setMsg("Image uploaded. Adjust crop.");
  };

  const onCropComplete = useCallback((_a: any, b: any) => {
    setCroppedPixels(b);
  }, []);

  /* ========================= */
  const download = async () => {
    if (!imageSrc) return;
    setLoading(true);
    setMsg("");

    try {
      let canvas: HTMLCanvasElement;

      if (mode === "easy") {
        canvas = await getCroppedCanvas(imageSrc, croppedPixels);
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
        canvas = c;
      }

      const blob = await new Promise<Blob>((resolve) =>
        canvas.toBlob((b) => resolve(b!), "image/jpeg", 0.95)
      );

      downloadBlob(blob, "cropped-image.jpg");
      setMsg("Image cropped successfully");
    } catch {
      alert("Crop failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-1">Image Crop Tool</h1>

      {/* ASPECTS */}
      <div className="flex flex-wrap gap-2 mb-4">
        {ASPECTS.map((a) => (
          <button
            key={a.label}
            onClick={() => {
              if (a.label === "Free") {
                setMode("resize");
                setAspect(undefined);
              } else {
                setMode("easy");
                setAspect(a.value);
              }
            }}
            className="px-3 py-1 border rounded-full text-sm bg-white"
          >
            {a.label}
          </button>
        ))}
      </div>

      {/* CROP AREA */}
      <div className="bg-gray-100 rounded-xl overflow-hidden mb-4">
        {!imageSrc ? (
          <label className="h-[360px] flex items-center justify-center cursor-pointer text-gray-500">
            <input
              type="file"
              accept="image/*"
              onChange={onSelectFile}
              className="hidden"
            />
            Tap to upload image
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
            <img
              ref={imgRef}
              src={imageSrc}
              alt=""
              className="max-h-[360px]"
            />
          </ReactCrop>
        )}
      </div>

      {/* ZOOM only for easy */}
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
        {loading ? "Cropping..." : "Download Cropped Image"}
      </button>

      {msg && <p className="text-green-600 text-sm mt-2">{msg}</p>}
    </div>
  );
}
