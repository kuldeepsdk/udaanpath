"use client";

import { useState, useEffect } from "react";
import { updatePaperAction } from "@/app/actions/ueas/papers.actions";

export default function EditPaperModal({
  open,
  paper,
  onClose,
  onUpdated,
}: {
  open: boolean;
  paper: any;
  onClose: () => void;
  onUpdated: () => void;
}) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    default_duration_minutes: 60,
    is_active: 1 as 0 | 1,
  });

  /* ---------------- INIT FORM ---------------- */
  useEffect(() => {
    if (paper && open) {
      setForm({
        name: paper.name || "",
        description: paper.description || "",
        default_duration_minutes:
          paper.default_duration_minutes || 60,
        is_active: paper.is_active ? 1 : 0,
      });
    }
  }, [paper, open]);

  if (!open) return null;

  /* ---------------- SUBMIT ---------------- */
  async function submit() {
    if (!form.name.trim()) {
      alert("Paper name is required");
      return;
    }

    setLoading(true);
    try {
      await updatePaperAction(paper.id, {
        name: form.name,
        description: form.description,
        default_duration_minutes: form.default_duration_minutes,
        is_active: form.is_active,
      });

      onClose();
      onUpdated(); // 🔄 reload paper details
    } catch (e: any) {
      alert(e.message || "Failed to update paper");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl w-full max-w-md p-6">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-800">
            Edit Paper
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            ✕
          </button>
        </div>

        {/* FORM */}
        <div className="space-y-4">

          {/* Name */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Paper Name
            </label>
            <input
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              className="w-full rounded-lg border px-3 py-2 text-sm
                         focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="w-full rounded-lg border px-3 py-2 text-sm
                         focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Duration */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Duration (minutes)
            </label>
            <input
              type="number"
              min={1}
              value={form.default_duration_minutes}
              onChange={(e) =>
                setForm({
                  ...form,
                  default_duration_minutes: Number(e.target.value),
                })
              }
              className="w-full rounded-lg border px-3 py-2 text-sm"
            />
          </div>

          {/* Status */}
          <div className="flex items-center gap-3 pt-1">
            <input
              type="checkbox"
              checked={form.is_active === 1}
              onChange={(e) =>
                setForm({
                  ...form,
                  is_active: e.target.checked ? 1 : 0,
                })
              }
            />
            <span className="text-sm text-slate-700">
              Paper is active
            </span>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded border text-sm"
          >
            Cancel
          </button>

          <button
            onClick={submit}
            disabled={loading}
            className="px-4 py-2 rounded bg-blue-600 text-white text-sm
                       disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
