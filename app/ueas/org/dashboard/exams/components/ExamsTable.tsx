"use client";

import { useRouter } from "next/navigation";

/* ---------------- TYPES ---------------- */

interface Exam {
  id: string;
  name: string;
  exam_date: string;
  start_time: string;
  end_time: string;
  status?: string;
  created_at: string;
}

/* ---------------- COMPONENT ---------------- */

export default function ExamsTable({
  exams,
  loading,
}: {
  exams: Exam[];
  loading: boolean;
}) {
  const router = useRouter();

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <div className="bg-white border rounded-xl p-6 text-sm text-slate-500">
        Loading exams…
      </div>
    );
  }

  /* ---------------- EMPTY ---------------- */
  if (!exams || exams.length === 0) {
    return (
      <div className="bg-white border rounded-xl p-6 text-sm text-slate-500">
        No exams created yet
      </div>
    );
  }

  /* ---------------- TABLE ---------------- */
  return (
    <div className="bg-white border rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 border-b">
          <tr>
            <th className="px-4 py-3 text-left">Exam Name</th>
            <th className="px-4 py-3 text-left">Date</th>
            <th className="px-4 py-3 text-left">Time</th>
            <th className="px-4 py-3 text-center">Status</th>
            <th className="px-4 py-3 text-center">Created</th>
          </tr>
        </thead>

        <tbody>
          {exams.map((e) => (
            <tr
              key={e.id}
              className="border-b last:border-b-0 hover:bg-slate-50 cursor-pointer"
              onClick={() =>
                router.push(
                  `/ueas/org/dashboard/exams/${e.id}`
                )
              }
            >
              {/* NAME */}
              <td className="px-4 py-3 font-medium text-slate-900">
                {e.name}
              </td>

              {/* DATE */}
              <td className="px-4 py-3">
                {new Date(e.exam_date).toLocaleDateString()}
              </td>

              {/* TIME */}
              <td className="px-4 py-3">
                {e.start_time} – {e.end_time}
              </td>

              {/* STATUS */}
              <td className="px-4 py-3 text-center">
                <StatusBadge status={e.status} />
              </td>

              {/* CREATED */}
              <td className="px-4 py-3 text-center text-xs text-slate-500">
                {new Date(e.created_at).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ---------------- STATUS BADGE ---------------- */

function StatusBadge({ status }: { status?: string }) {
  const s = status || "draft";

  const styles: Record<string, string> = {
    draft: "bg-slate-100 text-slate-600",
    published: "bg-blue-100 text-blue-700",
    completed: "bg-green-100 text-green-700",
  };

  return (
    <span
      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
        styles[s] || styles.draft
      }`}
    >
      {s.charAt(0).toUpperCase() + s.slice(1)}
    </span>
  );
}
