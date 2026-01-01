"use client";

import { useState } from "react";
import { createPaperAction } from "@/app/actions/ueas/papers.actions";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export default function CreatePaperModal({
  open,
  onClose,
  onCreated,
}: Props) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    duration: 60,
    instructions: "",
  });

  const [loading, setLoading] = useState(false);

  if (!open) return null;

  async function submit() {
    if (!form.name.trim()) {
      alert("Paper name is required");
      return;
    }

    setLoading(true);
    try {
      await createPaperAction({
        name: form.name.trim(),
        description: form.description.trim() || undefined,
        default_duration_minutes: form.duration,
        instructions: form.instructions.trim() || undefined,
      });

      setForm({
        name: "",
        description: "",
        duration: 60,
        instructions: "",
      });

      onClose();
      onCreated();
    } catch (e: any) {
      alert(e.message || "Failed to create paper");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl overflow-hidden">

        {/* ================= HEADER ================= */}
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">
              Create New Question Paper
            </h2>
            <p className="text-sm text-slate-500">
              Define paper structure and default exam settings
            </p>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500"
          >
            ✕
          </button>
        </div>

        {/* ================= BODY ================= */}
        <div className="p-6 space-y-8">

          {/* ---------- BASIC INFO ---------- */}
          <section>
            <h3 className="text-sm font-semibold text-slate-700 mb-3">
              Paper Details
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Paper Name <span className="text-red-500">*</span>
                </label>
                <input
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  placeholder="e.g. Physics Mock Test – Class 12"
                  className="w-full rounded-lg border px-3 py-2 text-sm
                             focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <p className="text-xs text-slate-500 mt-1">
                  This name will be visible to students
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Short Description (optional)
                </label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="Briefly describe the purpose or syllabus of this paper"
                  className="w-full rounded-lg border px-3 py-2 text-sm
                             focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </section>

          {/* ---------- DEFAULT SETTINGS ---------- */}
          <section>
            <h3 className="text-sm font-semibold text-slate-700 mb-3">
              Default Exam Settings
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Default Duration (minutes)
                </label>
                <input
                  type="number"
                  min={1}
                  value={form.duration}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      duration: Number(e.target.value) || 60,
                    })
                  }
                  className="w-full rounded-lg border px-3 py-2 text-sm
                             focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Used as default duration when creating an exam
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Instructions for Students (optional)
                </label>
                <textarea
                  rows={4}
                  value={form.instructions}
                  onChange={(e) =>
                    setForm({ ...form, instructions: e.target.value })
                  }
                  placeholder="e.g. Each question carries 1 mark. No negative marking. Do not refresh the page during the exam."
                  className="w-full rounded-lg border px-3 py-2 text-sm
                             focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <p className="text-xs text-slate-500 mt-1">
                  These instructions are shown before the exam starts
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* ================= FOOTER ================= */}
        <div className="px-6 py-4 border-t bg-slate-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg border bg-white hover:bg-slate-100 text-sm"
          >
            Cancel
          </button>

          <button
            onClick={submit}
            disabled={loading}
            className="px-5 py-2 rounded-lg bg-blue-600 text-white text-sm
                       font-medium hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create Paper"}
          </button>
        </div>

      </div>
    </div>
  );
}
