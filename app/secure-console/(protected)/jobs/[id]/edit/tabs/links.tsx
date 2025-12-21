"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  addJobLinkAction,
  deleteJobLinkAction,
} from "@/app/actions/admin/jobs.links.action";

type JobLink = {
  id: number;
  link_type: string;
  label: string | null;
  url: string;
};

export const LINK_TYPES = [
  // 🔥 Primary actions
  { value: "apply", label: "Apply Online" },
  { value: "notification", label: "Official Notification (PDF)" },

  // 🧾 Exam related
  { value: "admit_card", label: "Admit Card" },
  { value: "result", label: "Result" },
  { value: "answer_key", label: "Answer Key" },
  { value: "cutoff", label: "Cut Off Marks" },
  { value: "merit_list", label: "Merit List" },

  // 📚 Preparation / info
  { value: "syllabus", label: "Syllabus" },
  { value: "exam_pattern", label: "Exam Pattern" },
  { value: "instructions", label: "Instructions / Guidelines" },
  { value: "eligibility", label: "Eligibility Criteria" },

  // 🏢 Official sources
  { value: "official", label: "Official Website" },
  { value: "portal", label: "Recruitment Portal" },

  // 🧑‍⚖️ Counselling / admission
  { value: "counselling", label: "Counselling" },
  { value: "seat_allotment", label: "Seat Allotment" },

  // 📄 Misc
  { value: "corrigendum", label: "Corrigendum / Notice" },
  { value: "download", label: "Important Download" },
  { value: "other", label: "Other Important Link" },
];


export default function JobLinksTab({
  jobId,
  links,
}: {
  jobId: string;
  links: JobLink[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const [form, setForm] = useState({
    link_type: "",
    label: "",
    url: "",
  });

  /* -------------------------
     Add Link
  -------------------------- */
  function handleAdd() {
    if (!form.link_type || !form.url) {
      alert("Link type and URL are required");
      return;
    }

    startTransition(async () => {
      await addJobLinkAction(jobId, {
        link_type: form.link_type,
        label: form.label || undefined,
        url: form.url.trim(),
      });

      setForm({ link_type: "", label: "", url: "" });
      router.refresh();
    });
  }

  /* -------------------------
     Delete Link
  -------------------------- */
  function handleDelete(linkId: number) {
    if (!confirm("Delete this link?")) return;

    startTransition(async () => {
      await deleteJobLinkAction(jobId, linkId);
      router.refresh();
    });
  }

  return (
    <div className="space-y-8">

      {/* Add new link */}
      <div className="bg-white border rounded-xl p-6 space-y-4">
        <h3 className="text-lg font-semibold text-slate-800">
          Add Important Link
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select
            label="Link Type *"
            value={form.link_type}
            onChange={(v) => setForm({ ...form, link_type: v })}
            options={LINK_TYPES}
          />

          <Input
            label="Label"
            placeholder="Apply Online Link"
            value={form.label}
            onChange={(v) => setForm({ ...form, label: v })}
          />

          <Input
            label="URL *"
            placeholder="https://..."
            value={form.url}
            onChange={(v) => setForm({ ...form, url: v })}
          />
        </div>

        <button
          disabled={pending}
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-60"
        >
          {pending ? "Saving..." : "Add Link"}
        </button>
      </div>

      {/* Existing links */}
      <div className="bg-white border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-left">Label</th>
              <th className="px-4 py-3 text-left">URL</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {links.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-6 text-center text-slate-500"
                >
                  No links added yet
                </td>
              </tr>
            )}

            {links.map((l) => (
              <tr key={l.id} className="border-b last:border-0">
                <td className="px-4 py-3 font-medium capitalize">
                  {l.link_type.replace("_", " ")}
                </td>
                <td className="px-4 py-3">{l.label || "-"}</td>
                <td className="px-4 py-3 truncate max-w-xs">
                  <a
                    href={l.url}
                    target="_blank"
                    className="text-blue-600 hover:underline"
                  >
                    {l.url}
                  </a>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    disabled={pending}
                    onClick={() => handleDelete(l.id)}
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
   Small UI helpers
-------------------------- */
function Input({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        className="w-full mt-1 border rounded-lg px-3 py-2"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label className="text-sm font-medium text-slate-700">
        {label}
      </label>
      <select
        className="w-full mt-1 border rounded-lg px-3 py-2 bg-white"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Select</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
