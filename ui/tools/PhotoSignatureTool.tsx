"use client";

import React, { useCallback, useState } from "react";
import Cropper from "react-easy-crop";
import JSZip from "jszip";
import { saveAs } from "file-saver";

import {
  readFileAsDataURL,
  getCroppedCanvas,
  resizeCanvas,
  compressToTargetKB,
} from "@/lib/imageTools";

/* ===============================
   PRESETS
=============================== */
const PHOTO_PRESET = { w: 300, h: 400, kb: 50 };
const SIGN_PRESET = { w: 300, h: 100, kb: 20 };

export default function PhotoSignatureTool() {
  const [photoSrc, setPhotoSrc] = useState<string | null>(null);
  const [signSrc, setSignSrc] = useState<string | null>(null);

  const [photoCrop, setPhotoCrop] = useState({ x: 0, y: 0 });
  const [signCrop, setSignCrop] = useState({ x: 0, y: 0 });

  const [photoZoom, setPhotoZoom] = useState(1.2);
  const [signZoom, setSignZoom] = useState(1.3);

  const [photoPixels, setPhotoPixels] = useState<any>(null);
  const [signPixels, setSignPixels] = useState<any>(null);

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const onPhotoComplete = useCallback((_a: any, b: any) => setPhotoPixels(b), []);
  const onSignComplete = useCallback((_a: any, b: any) => setSignPixels(b), []);

  /* ===============================
     Upload handlers
  =============================== */
  const handleUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "photo" | "sign"
  ) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const dataUrl = await readFileAsDataURL(f);
    type === "photo" ? setPhotoSrc(dataUrl) : setSignSrc(dataUrl);
  };

  /* ===============================
     Download ZIP
  =============================== */
  const download = async () => {
    if (!photoSrc || !signSrc || !photoPixels || !signPixels) {
      alert("Upload & crop both photo and signature");
      return;
    }

    setLoading(true);
    setMsg("");

    try {
      const zip = new JSZip();

      /* PHOTO */
      const pCanvas = resizeCanvas(
        await getCroppedCanvas(photoSrc, photoPixels),
        PHOTO_PRESET.w,
        PHOTO_PRESET.h
      );
      const pResult = await compressToTargetKB({
        canvas: pCanvas,
        targetKB: PHOTO_PRESET.kb,
      });
      zip.file("photo.jpg", pResult.blob);

      /* SIGNATURE */
      const sCanvas = resizeCanvas(
        await getCroppedCanvas(signSrc, signPixels),
        SIGN_PRESET.w,
        SIGN_PRESET.h
      );
      const sResult = await compressToTargetKB({
        canvas: sCanvas,
        targetKB: SIGN_PRESET.kb,
      });
      zip.file("signature.jpg", sResult.blob);

      const zipBlob = await zip.generateAsync({ type: "blob" });
      saveAs(zipBlob, "photo-signature.zip");

      setMsg("Downloaded photo & signature successfully");
    } catch (e) {
      console.error(e);
      alert("Processing failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-1">
        Photo + Signature Resize Tool
      </h1>
      <p className="text-sm text-gray-600 mb-6">
        Upload, crop & resize photo and signature together for govt exam forms.
      </p>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* ================= PHOTO ================= */}
        <div>
          <h2 className="font-semibold mb-2">📷 Photo</h2>

          <div className="bg-gray-100 rounded-xl overflow-hidden">
            {!photoSrc ? (
              <label className="h-[360px] flex items-center justify-center cursor-pointer text-gray-500">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleUpload(e, "photo")}
                  className="hidden"
                />
                Upload Photo
              </label>
            ) : (
              <div className="relative h-[360px] w-full overflow-hidden touch-none">
                <Cropper
                  image={photoSrc}
                  crop={photoCrop}
                  zoom={photoZoom}
                  aspect={3 / 4}
                  onCropChange={setPhotoCrop}
                  onZoomChange={setPhotoZoom}
                  onCropComplete={onPhotoComplete}
                />
              </div>
            )}
          </div>

          <input
            type="range"
            min={1}
            max={3}
            step={0.01}
            value={photoZoom}
            onChange={(e) => setPhotoZoom(+e.target.value)}
            className="w-full mt-2"
          />
        </div>

        {/* ================= SIGNATURE ================= */}
        <div>
          <h2 className="font-semibold mb-2">✍️ Signature</h2>

          <div className="bg-gray-100 rounded-xl overflow-hidden">
            {!signSrc ? (
              <label className="h-[200px] flex items-center justify-center cursor-pointer text-gray-500">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleUpload(e, "sign")}
                  className="hidden"
                />
                Upload Signature
              </label>
            ) : (
              <div className="relative h-[200px] w-full overflow-hidden touch-none">
                <Cropper
                  image={signSrc}
                  crop={signCrop}
                  zoom={signZoom}
                  aspect={3}
                  onCropChange={setSignCrop}
                  onZoomChange={setSignZoom}
                  onCropComplete={onSignComplete}
                />
              </div>
            )}
          </div>

          <input
            type="range"
            min={1}
            max={3}
            step={0.01}
            value={signZoom}
            onChange={(e) => setSignZoom(+e.target.value)}
            className="w-full mt-2"
          />
        </div>
      </div>

      <button
        onClick={download}
        disabled={loading}
        className="w-full bg-black text-white py-3 rounded-xl font-semibold mt-6"
      >
        {loading ? "Processing..." : "Download ZIP (Photo + Signature)"}
      </button>

      {msg && <p className="text-green-600 text-sm mt-2">{msg}</p>}

      <p className="text-xs text-gray-500 mt-3 text-center">
        🔒 Files are processed locally in your browser
      </p>
    </div>
  );
}
