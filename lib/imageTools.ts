// lib/imageTools.ts
export function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.crossOrigin = "anonymous";
    img.src = src;
  });
}

// pixelCrop: { x, y, width, height } in pixels
export async function getCroppedCanvas(
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number }
): Promise<HTMLCanvasElement> {
  const image = await loadImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");

  canvas.width = Math.max(1, Math.floor(pixelCrop.width));
  canvas.height = Math.max(1, Math.floor(pixelCrop.height));

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    canvas.width,
    canvas.height
  );

  return canvas;
}

export function resizeCanvas(
  srcCanvas: HTMLCanvasElement,
  outW: number,
  outH: number
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");

  canvas.width = Math.max(1, Math.floor(outW));
  canvas.height = Math.max(1, Math.floor(outH));

  // High quality scaling
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(srcCanvas, 0, 0, canvas.width, canvas.height);

  return canvas;
}

export function canvasToBlob(
  canvas: HTMLCanvasElement,
  mime: "image/jpeg" | "image/png" | "image/webp",
  quality?: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("Failed to export image"))),
      mime,
      quality
    );
  });
}

export async function compressToTargetKB(params: {
  canvas: HTMLCanvasElement;
  targetKB: number; // e.g. 50
  mime?: "image/jpeg" | "image/webp";
  maxIterations?: number;
}): Promise<{ blob: Blob; quality: number; sizeKB: number }> {
  const { canvas, targetKB, mime = "image/jpeg", maxIterations = 12 } = params;

  // Binary search on quality to hit target size
  let low = 0.2;
  let high = 0.95;
  let best: { blob: Blob; quality: number; sizeKB: number } | null = null;

  for (let i = 0; i < maxIterations; i++) {
    const q = (low + high) / 2;
    const blob = await canvasToBlob(canvas, mime, q);
    const sizeKB = blob.size / 1024;

    if (!best || Math.abs(sizeKB - targetKB) < Math.abs(best.sizeKB - targetKB)) {
      best = { blob, quality: q, sizeKB };
    }

    if (sizeKB > targetKB) {
      high = q; // need more compression
    } else {
      low = q; // can increase quality
    }
  }

  // If still larger than target, return best found (closest)
  if (!best) throw new Error("Compression failed");
  return best;
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
