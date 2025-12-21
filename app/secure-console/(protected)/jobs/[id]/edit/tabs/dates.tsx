"use client";

import { useState, useTransition } from "react";
import {
  addJobDateAction,
  deleteJobDateAction,
} from "@/app/actions/admin/jobs.dates.action";
import { useRouter } from "next/navigation";

type JobDate = {
  id: number;
  event_key: string;
  event_label: string;
  event_date: string | null;
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

  const [form, setForm] = useState<{
    event_key: string;
    event_label: string;
    event_date: string;
  }>({
    event_key: "",
    event_label: "",
    event_date: "",
  });

  /* ---------------------------
     Add Date
  ---------------------------- */
  function handleAdd() {
    if (!form.event_key || !form.event_label) {
      alert("Event key and label are required");
      return;
    }

    startTransition(async () => {
      await addJobDateAction(jobId, {
        event_key: form.event_key.trim(),
        event_label: form.event_label.trim(),
        event_date: form.event_date || null,
      });

      // reset form
      setForm({
        event_key: "",
        event_label: "",
        event_date: "",
      });

      // 🔥 refresh job edit page data
      router.refresh();
    });
  }

  /* ---------------------------
     Delete Date
  ---------------------------- */
  function handleDelete(dateId: number) {
    if (!confirm("Delete this date?")) return;

    startTransition(async () => {
      await deleteJobDateAction(jobId, dateId);
      router.refresh();
    });
  }

  return (
    <div className="space-y-8">

      {/* Add new date */}
      <div className="bg-white border rounded-xl p-6 space-y-4">
        <h3 className="text-lg font-semibold text-slate-800">
          Add Important Date
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Event Key *"
            placeholder="apply_start"
            value={form.event_key}
            onChange={(v) => setForm({ ...form, event_key: v })}
          />

          <Input
            label="Label *"
            placeholder="Application Start Date"
            value={form.event_label}
            onChange={(v) => setForm({ ...form, event_label: v })}
          />

          <Input
            label="Date"
            type="date"
            value={form.event_date}
            onChange={(v) => setForm({ ...form, event_date: v })}
          />
        </div>

        <button
          disabled={pending}
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-60"
        >
          {pending ? "Saving..." : "Add Date"}
        </button>
      </div>

      {/* Existing dates */}
      <div className="bg-white border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left">Key</th>
              <th className="px-4 py-3 text-left">Label</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-right">Action</th>
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
                <td className="px-4 py-3 font-mono text-xs">
                  {d.event_key}
                </td>
                <td className="px-4 py-3">{d.event_label}</td>
                <td className="px-4 py-3">
                  {d.event_date
                    ? new Date(d.event_date).toLocaleDateString()
                    : "-"}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    disabled={pending}
                    onClick={() => handleDelete(d.id)}
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

/* ---------------------------
   Small UI helper
---------------------------- */
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
