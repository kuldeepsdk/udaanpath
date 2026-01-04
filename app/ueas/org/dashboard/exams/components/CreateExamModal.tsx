"use client";

import { useState, useEffect } from "react";
import { createExamAction } from "@/app/actions/ueas/exams.actions";
import { getPapersAction } from "@/app/actions/ueas/papers.actions";

type ExamCredits = {
  enabled: boolean;
  total: number;
  used: number;
  remaining: number;
} | null;

export default function CreateExamModal({
  open,
  onClose,
  onCreated,
  credits,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
  credits: ExamCredits;
}) {
  const [papers, setPapers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<any>({
    name: "",
    paper_id: "",
    exam_date: "",
    start_time: "",
    end_time: "",
    duration_minutes: 60,
    show_score_after_exam: true,
    show_answers: false,
    negative_marking: false,
    randomize_questions: true,
    randomize_options: true,
  });

  /* ---------- CREDIT CHECK ---------- */
  const canCreateExam =
    credits?.enabled === true && (credits?.remaining ?? 0) > 0;

  /* ---------- LOAD PAPERS ---------- */
  useEffect(() => {
    if (open) {
      getPapersAction({ limit: 100 }).then((r) =>
        setPapers(r.papers || [])
      );
    }
  }, [open]);

  if (!open) return null;

  function update(key: string, value: any) {
    setForm((prev: any) => ({ ...prev, [key]: value }));
  }

  /* ---------- SUBMIT ---------- */
  async function submit() {
    // 🔐 HARD CREDIT BLOCK
    if (!canCreateExam) {
      alert(
        "You do not have any exam credits left. Please purchase more exams to continue."
      );
      return;
    }

    if (!form.name || !form.paper_id || !form.exam_date) {
      alert("Please fill required fields");
      return;
    }

    setLoading(true);
    try {
      await createExamAction(form);
      onClose();
      onCreated();
    } catch (e: any) {
      alert(e.message || "Failed to create exam");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-xl overflow-hidden">

        {/* ================= HEADER ================= */}
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">
              Create New Exam
            </h2>
            <p className="text-sm text-slate-500">
              Configure exam paper, schedule and settings
            </p>

            {/* 🎫 CREDIT INFO */}
            {credits?.enabled && (
              <p className="mt-1 text-xs text-slate-600">
                🎫 Exam Credits Remaining:{" "}
                <b>{credits.remaining}</b> / {credits.total}
              </p>
            )}
          </div>

          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500"
          >
            ✕
          </button>
        </div>

        {/* ================= BODY ================= */}
        <div className="p-6 space-y-8">

          {/* ---------- BASIC DETAILS ---------- */}
          <section>
            <h3 className="text-sm font-semibold text-slate-700 mb-3">
              Exam Details
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Exam Name
                </label>
                <input
                  className="border rounded-lg w-full px-3 py-2"
                  placeholder="e.g. Mid Term Assessment – Computer Science"
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Select Question Paper
                </label>
                <select
                  className="border rounded-lg w-full px-3 py-2"
                  value={form.paper_id}
                  onChange={(e) => update("paper_id", e.target.value)}
                >
                  <option value="">Choose a paper</option>
                  {papers.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* ---------- SCHEDULE ---------- */}
          <section>
            <h3 className="text-sm font-semibold text-slate-700 mb-3">
              Exam Schedule
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <input
                type="date"
                className="border rounded-lg px-3 py-2"
                value={form.exam_date}
                onChange={(e) => update("exam_date", e.target.value)}
              />
              <input
                type="number"
                className="border rounded-lg px-3 py-2"
                value={form.duration_minutes}
                onChange={(e) =>
                  update("duration_minutes", Number(e.target.value))
                }
              />
              <input
                type="time"
                className="border rounded-lg px-3 py-2"
                value={form.start_time}
                onChange={(e) => update("start_time", e.target.value)}
              />
              <input
                type="time"
                className="border rounded-lg px-3 py-2"
                value={form.end_time}
                onChange={(e) => update("end_time", e.target.value)}
              />
            </div>
          </section>

          {/* ---------- SETTINGS ---------- */}
          <section>
            <h3 className="text-sm font-semibold text-slate-700 mb-3">
              Exam Settings
            </h3>

            <div className="grid grid-cols-2 gap-4 text-sm">
              {[
                ["show_score_after_exam", "Show score after exam"],
                ["show_answers", "Show correct answers"],
                ["negative_marking", "Enable negative marking"],
                ["randomize_questions", "Randomize questions"],
                ["randomize_options", "Randomize options"],
              ].map(([key, label]) => (
                <label
                  key={key}
                  className="flex items-center gap-2 p-3 border rounded-lg"
                >
                  <input
                    type="checkbox"
                    checked={form[key]}
                    onChange={(e) => update(key, e.target.checked)}
                  />
                  {label}
                </label>
              ))}
            </div>
          </section>
        </div>

        {/* ================= FOOTER ================= */}
        <div className="px-6 py-4 border-t bg-slate-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg border bg-white hover:bg-slate-100"
          >
            Cancel
          </button>

          <button
            onClick={submit}
            disabled={loading || !canCreateExam}
            className={`px-5 py-2 rounded-lg text-white
              ${
                canCreateExam
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-slate-400 cursor-not-allowed"
              }
              disabled:opacity-60`}
          >
            {loading
              ? "Creating..."
              : canCreateExam
              ? "Create Exam"
              : "No Credits Left"}
          </button>
        </div>
      </div>
    </div>
  );
}
