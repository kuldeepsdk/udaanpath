"use client";

import Link from "next/link";

export default function ExamHeader({
  exam,
  onAssignBatches,
}: {
  exam: any;
  onAssignBatches: () => void;
}) {
  return (
    <div className="bg-white border rounded-xl p-6 mb-6">

      {/* ================= TOP ================= */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">

        {/* LEFT */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            {exam.name}
            <StatusBadge status={exam.status} />
          </h1>

          <p className="text-sm text-slate-600 mt-1">
            Exam Date:{" "}
            <span className="font-medium">
              {new Date(exam.exam_date).toLocaleDateString()}
            </span>
            {" · "}
            {exam.start_time} – {exam.end_time}
          </p>
        </div>

        {/* RIGHT ACTIONS */}
        <div className="flex gap-2 flex-wrap">

          {/* STUDENTS PAGE LINK */}
          <Link
            href={`/ueas/org/dashboard/exams/${exam.id}/students`}
            className="rounded-lg bg-indigo-600 px-4 py-2
                       text-sm font-medium text-white
                       hover:bg-indigo-700"
          >
            👥 View Students
          </Link>

          {/* ASSIGN BATCHES */}
          <button
            onClick={onAssignBatches}
            className="rounded-lg border px-4 py-2
                       text-sm font-medium
                       hover:bg-slate-50"
          >
            + Assign Batches
          </button>
        </div>
      </div>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 text-sm">
        <Stat label="Duration" value={`${exam.duration_minutes} min`} />
        <Stat
          label="Negative Marking"
          value={exam.negative_marking ? "Yes" : "No"}
        />
        <Stat
          label="Random Questions"
          value={exam.randomize_questions ? "Yes" : "No"}
        />
        <Stat
          label="Random Options"
          value={exam.randomize_options ? "Yes" : "No"}
        />
      </div>
    </div>
  );
}

/* ---------------- SMALL COMPONENTS ---------------- */

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-slate-500">{label}</span>
      <div className="font-semibold">{value}</div>
    </div>
  );
}

/* ---------------- STATUS BADGE ---------------- */

function StatusBadge({ status }: { status?: string }) {
  const s = status || "draft";

  const styles: Record<string, string> = {
    draft: "bg-slate-100 text-slate-600",
    scheduled: "bg-blue-100 text-blue-700",
    ongoing: "bg-yellow-100 text-yellow-700",
    completed: "bg-green-100 text-green-700",
  };

  return (
    <span
      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
        styles[s] || styles.draft
      }`}
    >
      {s.charAt(0).toUpperCase() + s.slice(1)}
    </span>
  );
}
