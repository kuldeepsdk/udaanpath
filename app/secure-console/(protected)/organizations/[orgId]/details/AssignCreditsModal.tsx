"use client";

import { useState } from "react";
import { assignOrgCreditsAction } from "@/app/actions/admin/organization.action";

export default function AssignCreditsModal({
  open,
  onClose,
  orgId,
  onAssigned,
}: {
  open: boolean;
  onClose: () => void;
  orgId: string;
  onAssigned: () => void;
}) {
  const [credits, setCredits] = useState(5);
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  async function submit() {
    setLoading(true);
    try {
      await assignOrgCreditsAction(orgId, credits, remarks);
      onAssigned();
      onClose();
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-full max-w-md rounded-xl p-6 space-y-4">
        <h3 className="text-lg font-semibold">Assign Exam Credits</h3>

        <input
          type="number"
          min={1}
          className="w-full border rounded px-3 py-2"
          value={credits}
          onChange={(e) => setCredits(Number(e.target.value))}
        />

        <textarea
          className="w-full border rounded px-3 py-2"
          placeholder="Remarks (optional)"
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
        />

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 border rounded">
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            {loading ? "Assigning..." : "Assign"}
          </button>
        </div>
      </div>
    </div>
  );
}
