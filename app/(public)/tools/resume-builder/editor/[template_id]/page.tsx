"use client";

import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { RESUME_TEMPLATES } from "@/lib/resume-templates/templates";

// layouts
import ClassicResume from "@/lib/resume-templates/layouts/classic";
import HeaderBandResume from "@/lib/resume-templates/layouts/header-band";
import SidebarResume from "@/lib/resume-templates/layouts/sidebar";
import ModernCardResume from "@/lib/resume-templates/layouts/modern-card";

import PhotoUploader from "@/app/(public)/tools/resume-builder/components/resume/PhotoUploader";

export default function ResumeEditorPage() {
  const params = useParams();
  const router = useRouter();

  const templateId = params.template_id as string;
  const template = RESUME_TEMPLATES.find((t) => t.id === templateId);

  // 📸 photo state (base64)
  const [photo, setPhoto] = useState<string | null>(null);

  /* ================= RESTORE PHOTO ================= */
  useEffect(() => {
    if (!templateId) return;
    const saved = localStorage.getItem(`resume_photo_${templateId}`);
    if (saved) setPhoto(saved);
  }, [templateId]);

  /* ================= SAVE PHOTO ================= */
  useEffect(() => {
    if (!templateId) return;
    if (photo) {
      localStorage.setItem(`resume_photo_${templateId}`, photo);
    } else {
      localStorage.removeItem(`resume_photo_${templateId}`);
    }
  }, [photo, templateId]);

  if (!template) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-2">Template Not Found</h1>
        <p className="text-gray-600 mb-6">
          The resume template you are trying to access does not exist.
        </p>
        <button
          onClick={() => router.push("/tools/resume-builder")}
          className="bg-indigo-600 text-white px-5 py-2 rounded-lg"
        >
          Back to Resume Builder
        </button>
      </div>
    );
  }

  /* ================= LAYOUT SWITCHER ================= */
  const renderLayout = () => {
    switch (template.layout) {
      case "classic":
        return <ClassicResume photo={photo} />;
      case "header-band":
        return <HeaderBandResume photo={photo} />;
      case "sidebar":
        return <SidebarResume photo={photo} />;
      case "modern-card":
        return <ModernCardResume photo={photo} />;
      default:
        return <ClassicResume photo={photo} />;
    }
  };

  /* ================= PDF DOWNLOAD ================= */
  const handleDownloadPDF = useCallback(async () => {
    if (typeof window === "undefined") return;

    const element = document.querySelector(".resume-page") as HTMLElement | null;
    if (!element) {
      alert("Resume content not found");
      return;
    }

    const mod = await import("html2pdf.js");
    const html2pdf = (mod as any).default ?? (mod as any);

    const fileName = `${template.name
      .toLowerCase()
      .replace(/\s+/g, "_")}_resume.pdf`;

    const options = {
      margin: 0,
      filename: fileName,
      image: { type: "jpeg" as const, quality: 0.98 },

      html2canvas: {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",

        // 🔥 Tailwind lab()/oklch() fix
        onclone: (clonedDoc: Document) => {
          clonedDoc
            .querySelectorAll<HTMLElement>("*")
            .forEach((el) => {
              const style = window.getComputedStyle(el);

              if (
                style.color.startsWith("lab") ||
                style.color.startsWith("oklch")
              ) {
                el.style.color = "#000";
              }

              if (
                style.backgroundColor.startsWith("lab") ||
                style.backgroundColor.startsWith("oklch")
              ) {
                el.style.backgroundColor = "#fff";
              }

              if (
                style.borderColor.startsWith("lab") ||
                style.borderColor.startsWith("oklch")
              ) {
                el.style.borderColor = "#000";
              }
            });
        },
      },

      jsPDF: {
        unit: "mm" as const,
        format: "a4" as const,
        orientation: "portrait" as const,
      },
    };

    await html2pdf().set(options).from(element).save();
  }, [template.name]);

  return (
    <main className="bg-gray-100 min-h-screen">
      {/* ================= TOP BAR ================= */}
      <div className="sticky top-0 z-30 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => router.push("/tools/resume-builder")}
            className="text-sm text-gray-600 hover:text-black"
          >
            ← Back
          </button>

          <div>
            <h1 className="font-semibold text-sm sm:text-base">
              {template.name}
            </h1>
            <p className="text-xs text-gray-500 hidden sm:block">
              {template.description}
            </p>
          </div>

          <button
            className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700"
            onClick={handleDownloadPDF}
          >
            Download PDF
          </button>
        </div>
      </div>

      {/* ================= EDITOR LAYOUT ================= */}
      <div className="max-w-7xl mx-auto px-4 py-8 grid lg:grid-cols-12 gap-6">
        {/* LEFT PANEL */}
        <aside className="lg:col-span-3 bg-white rounded-xl border p-4 h-fit sticky top-20">
          <h2 className="font-semibold mb-2 text-sm">Resume Editor</h2>

          <p className="text-xs text-gray-600 mb-4">
            Click directly on resume content to edit.
          </p>

          {/* 📸 PHOTO UPLOADER */}
          <PhotoUploader value={photo} onChange={setPhoto} />

          <hr className="my-4" />

          <div className="space-y-2 text-sm">
            <div className="bg-gray-50 p-2 rounded">
              ✏️ Click text to edit
            </div>
            <div className="bg-gray-50 p-2 rounded">
              📄 Real A4 size preview
            </div>
            <div className="bg-gray-50 p-2 rounded">
              💾 Auto saved locally
            </div>
          </div>

          <hr className="my-4" />

          <p className="text-xs text-gray-500">
            Tip: Keep resume to 1–2 pages and focus on relevant information.
          </p>
        </aside>

        {/* RESUME PREVIEW */}
        <div className="lg:col-span-9 overflow-auto">
          {renderLayout()}
        </div>
      </div>
    </main>
  );
}
