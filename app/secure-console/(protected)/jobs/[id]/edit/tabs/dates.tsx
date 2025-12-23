"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import {
  addJobDatesBulkAction,
  deleteJobDatesBulkAction,
} from "@/app/actions/admin/jobs.dates.action";

type JobDate = {
  id: number;
  event_key: string;
  event_label: string;
  event_date: string | null;
};

type DraftDate = {
  event_key: string;
  event_label: string;
  event_date: string;
};

export default function JobDatesTab({
  jobId,
  dates,
}: {
  jobId: string;
  dates: JobDate[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  /* ===============================
     STATE
  ================================ */
  const [drafts, setDrafts] = useState<DraftDate[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  /* ===============================
     ADD DRAFT ROW
  ================================ */
  function addDraft() {
    setDrafts((d) => [
      ...d,
      { event_key: "", event_label: "", event_date: "" },
    ]);
  }

  function updateDraft(
    index: number,
    field: keyof DraftDate,
    value: string
  ) {
    const copy = [...drafts];
    copy[index][field] = value;
    setDrafts(copy);
  }

  function removeDraft(index: number) {
    setDrafts(drafts.filter((_, i) => i !== index));
  }

  /* ===============================
     SAVE ALL DRAFTS (BULK ADD)
  ================================ */
  function saveAll() {
    if (drafts.length === 0) return;

    const payload = drafts
      .filter((d) => d.event_key && d.event_label)
      .map((d) => ({
        event_key: d.event_key.trim(),
        event_label: d.event_label.trim(),
        event_date: d.event_date || null,
      }));

    if (payload.length === 0) {
      alert("Please fill at least one valid date");
      return;
    }

    startTransition(async () => {
      await addJobDatesBulkAction(jobId, payload);
      setDrafts([]);
      router.refresh();
    });
  }

  /* ===============================
     BULK DELETE
  ================================ */
  function toggleSelect(id: number) {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  }

  function deleteSelected() {
    const validIds = selectedIds.filter(
      (id): id is number => typeof id === "number"
    );

    if (validIds.length === 0) {
      alert("No valid dates selected");
      return;
    }

    if (!confirm(`Delete ${validIds.length} dates?`)) return;

    startTransition(async () => {
      await deleteJobDatesBulkAction(jobId, validIds);
      setSelectedIds([]);
      router.refresh();
    });
  }


  /* ===============================
     RENDER
  ================================ */
  return (
    <div className="space-y-8">

      {/* ================= ADD DATES ================= */}
      <div className="bg-white border rounded-xl p-6 space-y-4">
        <h3 className="text-lg font-semibold text-slate-800">
          Add Important Dates (Bulk)
        </h3>

        {drafts.map((d, i) => (
          <div
            key={i}
            className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
          >
            <Input
              label="Event Key *"
              placeholder="apply_start"
              value={d.event_key}
              onChange={(v) => updateDraft(i, "event_key", v)}
            />

            <Input
              label="Label *"
              placeholder="Application Start Date"
              value={d.event_label}
              onChange={(v) => updateDraft(i, "event_label", v)}
            />

            <Input
              label="Date"
              type="date"
              value={d.event_date}
              onChange={(v) => updateDraft(i, "event_date", v)}
            />

            <button
              onClick={() => removeDraft(i)}
              className="text-red-600 text-sm"
            >
              Remove
            </button>
          </div>
        ))}

        <div className="flex gap-3">
          <button
            onClick={addDraft}
            className="bg-slate-100 px-4 py-2 rounded-lg text-sm"
          >
            + Add Row
          </button>

          <button
            disabled={pending}
            onClick={saveAll}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm disabled:opacity-60"
          >
            {pending ? "Saving..." : "Save All Dates"}
          </button>
        </div>
      </div>

      {/* ================= EXISTING DATES ================= */}
      <div className="bg-white border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={
                    dates.length > 0 &&
                    selectedIds.length === dates.length
                  }
                  onChange={(e) =>
                    setSelectedIds(
                      e.target.checked ? dates.map((d) => d.id) : []
                    )
                  }
                />
              </th>
              <th className="px-4 py-3 text-left">Key</th>
              <th className="px-4 py-3 text-left">Label</th>
              <th className="px-4 py-3 text-left">Date</th>
            </tr>
          </thead>

          <tbody>
            {dates.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-6 text-center text-slate-500"
                >
                  No dates added yet
                </td>
              </tr>
            )}

            {dates.map((d) => (
              <tr key={d.id} className="border-b last:border-0">
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(d.id)}
                    onChange={() => toggleSelect(d.id)}
                  />
                </td>
                <td className="px-4 py-3 font-mono text-xs">
                  {d.event_key}
                </td>
                <td className="px-4 py-3">{d.event_label}</td>
                <td className="px-4 py-3">
                  {d.event_date
                    ? new Date(d.event_date).toLocaleDateString()
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {selectedIds.length > 0 && (
          <div className="p-4 border-t flex justify-end">
            <button
              disabled={pending}
              onClick={deleteSelected}
              className="text-red-600 text-sm disabled:opacity-50"
            >
              Delete Selected ({selectedIds.length})
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ===============================
   Small UI helper
================================ */
function Input({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        type={type}
        className="w-full mt-1 border rounded-lg px-3 py-2"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
