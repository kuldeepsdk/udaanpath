"use client";

import { useState } from "react";
import { createBatchAction } from "@/app/actions/ueas/batch.actions";

export default function CreateBatchModal({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}) {
  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);

  if (!open) return null;

  async function submit() {
    if (!form.name.trim()) {
      alert("Batch name is required");
      return;
    }

    setLoading(true);
    try {
      await createBatchAction({
        name: form.name.trim(),
        description: form.description?.trim() || undefined,
      });

      setForm({ name: "", description: "" });
      onClose();
      onCreated();
    } catch (e: any) {
      alert(e.message || "Failed to create batch");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">

      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl animate-in fade-in zoom-in">

        {/* HEADER */}
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold text-slate-900">
            Create New Batch
          </h2>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-xl leading-none"
          >
            ×
          </button>
        </div>

        {/* BODY */}
        <div className="px-6 py-5 space-y-4">

          {/* Batch Name */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Batch Name <span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              placeholder="e.g. Class 10 - Maths Batch"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              className="w-full rounded-lg border px-3 py-2 text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Description (optional)
            </label>

            <textarea
              rows={3}
              placeholder="Short description about this batch"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="w-full rounded-lg border px-3 py-2 text-sm resize-none
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

        </div>

        {/* FOOTER */}
        <div className="px-6 py-4 border-t flex justify-end gap-2">

          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded-lg border text-sm
                       hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            onClick={submit}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold
                       hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Batch"}
          </button>

        </div>

      </div>
    </div>
  );
}
