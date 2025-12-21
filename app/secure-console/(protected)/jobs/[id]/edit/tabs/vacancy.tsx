"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  addJobVacancyAction,
  deleteJobVacancyAction,
} from "@/app/actions/admin/jobs.vacancy.action";

type VacancyRow = {
  id: number;
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

  const [form, setForm] = useState<{
    post_name: string;
    total_posts: string;
  }>({
    post_name: "",
    total_posts: "",
  });

  /* -------------------------
     Add Vacancy
  -------------------------- */
  function handleAdd() {
    if (!form.post_name || !form.total_posts) {
      alert("Post name and total posts are required");
      return;
    }

    const total = Number(form.total_posts);
    if (Number.isNaN(total) || total <= 0) {
      alert("Total posts must be a valid number");
      return;
    }

    startTransition(async () => {
      await addJobVacancyAction(jobId, {
        post_name: form.post_name.trim(),
        total_posts: total,
      });

      setForm({ post_name: "", total_posts: "" });
      router.refresh();
    });
  }

  /* -------------------------
     Delete Vacancy
  -------------------------- */
  function handleDelete(id: number) {
    if (!confirm("Delete this vacancy entry?")) return;

    startTransition(async () => {
      await deleteJobVacancyAction(jobId, id);
      router.refresh();
    });
  }

  return (
    <div className="space-y-8">

      {/* Add vacancy */}
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

        <button
          disabled={pending}
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-60"
        >
          {pending ? "Saving..." : "Add Vacancy"}
        </button>
      </div>

      {/* Vacancy list */}
      <div className="bg-white border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left">Post</th>
              <th className="px-4 py-3 text-left">Total Posts</th>
              <th className="px-4 py-3 text-right">Action</th>
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
                <td className="px-4 py-3 font-medium">
                  {v.post_name}
                </td>
                <td className="px-4 py-3">
                  {v.total_posts.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    disabled={pending}
                    onClick={() => handleDelete(v.id)}
                    className="text-red-600 hover:underline text-sm disabled:opacity-50"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

/* -------------------------
   Small UI helper
-------------------------- */
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
