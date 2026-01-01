"use client";

import { useEffect, useState } from "react";
import { getBatchesAction } from "@/app/actions/ueas/batch.actions";
import { assignExamBatchesAction } from "@/app/actions/ueas/exams.actions";

export default function AssignBatchesModal({
  open,
  examId,
  onClose,
  onAssigned,
}: {
  open: boolean;
  examId: string;
  onClose: () => void;
  onAssigned: () => void;
}) {
  const [batches, setBatches] = useState<any[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    async function loadBatches() {
      const res = await getBatchesAction();
      setBatches(res || []);
      setSelected([]);
    }

    loadBatches();
  }, [open]);

  if (!open) return null;

  function toggle(id: string) {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  }

  async function submit() {
    if (selected.length === 0) {
      alert("Select at least one batch");
      return;
    }

    setLoading(true);
    try {
      await assignExamBatchesAction(examId, selected);
      onClose();
      onAssigned();
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl w-full max-w-xl p-6 space-y-4">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">
            Assign Batches to Exam
          </h2>
          <button onClick={onClose} className="text-slate-500">✕</button>
        </div>

        {/* LIST */}
        <div className="border rounded-xl max-h-80 overflow-auto">
          {batches.length === 0 ? (
            <div className="p-4 text-sm text-slate-500">
              No batches found
            </div>
          ) : (
            batches.map((b) => (
              <label
                key={b.id}
                className="flex items-center gap-3 px-4 py-3
                           border-b last:border-b-0 cursor-pointer
                           hover:bg-slate-50"
              >
                <input
                  type="checkbox"
                  checked={selected.includes(b.id)}
                  onChange={() => toggle(b.id)}
                />
                <span className="text-sm font-medium">
                  {b.name}
                </span>
              </label>
            ))
          )}
        </div>

        {/* FOOTER */}
        <div className="flex justify-between items-center pt-2">
          <span className="text-xs text-slate-500">
            {selected.length} selected
          </span>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border rounded text-sm"
            >
              Cancel
            </button>
            <button
              onClick={submit}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white
                         rounded text-sm disabled:opacity-50"
            >
              Assign
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
