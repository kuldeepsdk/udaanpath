"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  addJobVacancyBulkAction,
  deleteJobVacancyBulkAction,
} from "@/app/actions/admin/jobs.vacancy.action";

type VacancyRow = {
  id: number;
  post_name: string;
  total_posts: number;
};

type DraftVacancy = {
  post_name: string;
  total_posts: number;
};

export default function JobVacancyTab({
  jobId,
  vacancy,
}: {
  jobId: string;
  vacancy: VacancyRow[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  /* =========================
     Draft (Temp Add Rows)
  ========================= */
  const [draftRows, setDraftRows] = useState<DraftVacancy[]>([]);

  const [form, setForm] = useState({
    post_name: "",
    total_posts: "",
  });

  /* =========================
     Existing Rows Selection
  ========================= */
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  /* =========================
     ADD → TEMP ROW
  ========================= */
  function handleAddRow() {
    const total = Number(form.total_posts);

    if (!form.post_name || !Number.isInteger(total) || total <= 0) {
      alert("Post name and valid total posts required");
      return;
    }

    setDraftRows((prev) => [
      ...prev,
      {
        post_name: form.post_name.trim(),
        total_posts: total,
      },
    ]);

    setForm({ post_name: "", total_posts: "" });
  }

  /* =========================
     REMOVE TEMP ROW
  ========================= */
  function removeDraftRow(index: number) {
    setDraftRows((prev) => prev.filter((_, i) => i !== index));
  }

  /* =========================
     SAVE ALL (BULK ADD)
  ========================= */
  function handleSaveAll() {
    if (draftRows.length === 0) return;

    startTransition(async () => {
      await addJobVacancyBulkAction(jobId, draftRows);
      setDraftRows([]);
      router.refresh();
    });
  }

  /* =========================
     SELECT EXISTING
  ========================= */
  function toggleSelect(id: number) {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  }

  function toggleSelectAll() {
    if (selectedIds.length === vacancy.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(vacancy.map((v) => v.id));
    }
  }

  /* =========================
     DELETE SELECTED (BULK)
  ========================= */
  function handleDeleteSelected() {
    if (selectedIds.length === 0) {
      alert("No vacancies selected");
      return;
    }

    if (!confirm(`Delete ${selectedIds.length} vacancy entries?`)) return;

    startTransition(async () => {
      await deleteJobVacancyBulkAction(jobId, selectedIds);
      setSelectedIds([]);
      router.refresh();
    });
  }

  return (
    <div className="space-y-8">

      {/* ================= ADD NEW ROW ================= */}
      <div className="bg-white border rounded-xl p-6 space-y-4">
        <h3 className="text-lg font-semibold text-slate-800">
          Add Vacancy Breakup
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Post Name *"
            placeholder="Clerk / Constable / JE"
            value={form.post_name}
            onChange={(v) => setForm({ ...form, post_name: v })}
          />

          <Input
            label="Total Posts *"
            type="number"
            placeholder="1200"
            value={form.total_posts}
            onChange={(v) => setForm({ ...form, total_posts: v })}
          />
        </div>

        <div className="flex gap-3">
          <button
            disabled={pending}
            onClick={handleAddRow}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-60"
          >
            + Add Row
          </button>

          <button
            disabled={pending || draftRows.length === 0}
            onClick={handleSaveAll}
            className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 disabled:opacity-60"
          >
            {pending ? "Saving..." : "Save All"}
          </button>
        </div>
      </div>

      {/* ================= TEMP ROWS ================= */}
      {draftRows.length > 0 && (
        <div className="bg-yellow-50 border rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b font-semibold text-sm">
            Pending Vacancy Rows
          </div>

          <table className="w-full text-sm">
            <thead className="bg-yellow-100">
              <tr>
                <th className="px-4 py-2 text-left">Post</th>
                <th className="px-4 py-2 text-left">Total</th>
                <th className="px-4 py-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {draftRows.map((v, i) => (
                <tr key={i} className="border-b last:border-0">
                  <td className="px-4 py-2">{v.post_name}</td>
                  <td className="px-4 py-2">{v.total_posts}</td>
                  <td className="px-4 py-2 text-right">
                    <button
                      onClick={() => removeDraftRow(i)}
                      className="text-red-600 hover:underline text-sm"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ================= EXISTING VACANCY ================= */}
      <div className="bg-white border rounded-xl overflow-hidden">
        <div className="flex justify-between items-center px-4 py-3 border-b bg-slate-50">
          <h4 className="text-sm font-semibold">
            Existing Vacancy Breakup
          </h4>

          {selectedIds.length > 0 && (
            <button
              disabled={pending}
              onClick={handleDeleteSelected}
              className="text-red-600 text-sm hover:underline disabled:opacity-50"
            >
              Delete Selected ({selectedIds.length})
            </button>
          )}
        </div>

        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="px-4 py-3 w-10">
                <input
                  type="checkbox"
                  checked={
                    vacancy.length > 0 &&
                    selectedIds.length === vacancy.length
                  }
                  onChange={toggleSelectAll}
                />
              </th>
              <th className="px-4 py-3 text-left">Post</th>
              <th className="px-4 py-3 text-left">Total Posts</th>
            </tr>
          </thead>

          <tbody>
            {vacancy.length === 0 && (
              <tr>
                <td
                  colSpan={3}
                  className="px-4 py-6 text-center text-slate-500"
                >
                  No vacancy breakup added yet
                </td>
              </tr>
            )}

            {vacancy.map((v) => (
              <tr key={v.id} className="border-b last:border-0">
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(v.id)}
                    onChange={() => toggleSelect(v.id)}
                  />
                </td>
                <td className="px-4 py-3 font-medium">
                  {v.post_name}
                </td>
                <td className="px-4 py-3">
                  {v.total_posts.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

/* =========================
   Input Helper
========================= */
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
