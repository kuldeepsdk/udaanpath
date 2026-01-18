"use client";

import React, { useCallback, useRef, useState } from "react";
import Cropper from "react-easy-crop";
import {
  readFileAsDataURL,
  getCroppedCanvas,
  resizeCanvas,
  downloadBlob,
} from "@/lib/imageTools";

export default function PassportPhotoTool() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1.2);
  const [croppedPixels, setCroppedPixels] = useState<any>(null);

  const [name, setName] = useState("YOUR NAME");
  const [date, setDate] = useState(
    new Date().toLocaleDateString("en-GB")
  );

  const [fontSize, setFontSize] = useState(18);
  const [textColor, setTextColor] = useState("#000000");

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(false);

  const onCropComplete = useCallback((_a: any, b: any) => {
    setCroppedPixels(b);
  }, []);

  const onSelectFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const dataUrl = await readFileAsDataURL(f);
    setImageSrc(dataUrl);
  };

  /* ===============================
     Final draw
  =============================== */
  const generate = async () => {
    if (!imageSrc || !croppedPixels) return;
    setLoading(true);

    const cropped = await getCroppedCanvas(imageSrc, croppedPixels);
    const photo = resizeCanvas(cropped, 350, 450); // passport size

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;

    const textHeight = 60;
    canvas.width = photo.width;
    canvas.height = photo.height + textHeight;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(photo, 0, 0);

    ctx.fillStyle = textColor;
    ctx.font = `${fontSize}px Arial`;
    ctx.textAlign = "center";

    ctx.fillText(name, canvas.width / 2, photo.height + 25);
    ctx.fillText(date, canvas.width / 2, photo.height + 50);

    canvasRef.current = canvas;

    const blob = await new Promise<Blob>((resolve) =>
      canvas.toBlob((b) => resolve(b!), "image/jpeg", 0.95)
    );

    downloadBlob(blob, "passport-photo.jpg");
    setLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-1">
        Passport Photo with Name & Date
      </h1>
      <p className="text-sm text-gray-600 mb-4">
        Create passport size photo with name & date below for exam forms.
      </p>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* CROP */}
        <div className="bg-gray-100 rounded-xl overflow-hidden">
          {!imageSrc ? (
            <label className="h-[360px] flex items-center justify-center cursor-pointer text-gray-500">
              <input
                type="file"
                accept="image/*"
                onChange={onSelectFile}
                className="hidden"
              />
              Upload Photo
            </label>
          ) : (
            <div className="relative h-[360px] w-full">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={3.5 / 4.5}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
          )}
        </div>

        {/* CONTROLS */}
        <div className="bg-white p-4 rounded-xl shadow-sm space-y-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value.toUpperCase())}
            placeholder="Enter name"
            className="w-full border rounded px-3 py-2"
          />

          <input
            type="date"
            onChange={(e) => {
              const d = new Date(e.target.value);
              setDate(d.toLocaleDateString("en-GB"));
            }}
            className="w-full border rounded px-3 py-2"
          />

          <div className="flex gap-2 items-center">
            <label className="text-sm">Font size</label>
            <input
              type="range"
              min={14}
              max={28}
              value={fontSize}
              onChange={(e) => setFontSize(+e.target.value)}
            />
          </div>

          <div className="flex gap-2 items-center">
            <label className="text-sm">Text color</label>
            <input
              type="color"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
            />
          </div>

          <button
            onClick={generate}
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-xl font-semibold"
          >
            {loading ? "Generating..." : "Download Photo"}
          </button>

          <p className="text-xs text-gray-500">
            🔒 Photo is processed locally in your browser
          </p>
        </div>
      </div>
    </div>
  );
}
