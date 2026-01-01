"use client";

import { useState, useEffect } from "react";
import { createExamAction } from "@/app/actions/ueas/exams.actions";
import { getPapersAction } from "@/app/actions/ueas/papers.actions";

export default function CreateExamModal({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
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

  useEffect(() => {
    if (open) {
      getPapersAction({ limit: 100 }).then((r) =>
        setPapers(r.papers || [])
      );
    }
  }, [open]);

  if (!open) return null;

  function update(key: string, value: any) {
    setForm({ ...form, [key]: value });
  }

  async function submit() {
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
      alert(e.message);
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
                <p className="text-xs text-slate-500 mt-1">
                  This name will be visible to students
                </p>
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
                <p className="text-xs text-slate-500 mt-1">
                  This paper’s questions will be used in the exam
                </p>
              </div>
            </div>
          </section>

          {/* ---------- SCHEDULE ---------- */}
          <section>
            <h3 className="text-sm font-semibold text-slate-700 mb-3">
              Exam Schedule
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Exam Date
                </label>
                <input
                  type="date"
                  className="border rounded-lg px-3 py-2 w-full"
                  value={form.exam_date}
                  onChange={(e) => update("exam_date", e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  className="border rounded-lg px-3 py-2 w-full"
                  placeholder="e.g. 60"
                  value={form.duration_minutes}
                  onChange={(e) =>
                    update("duration_minutes", Number(e.target.value))
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Start Time
                </label>
                <input
                  type="time"
                  className="border rounded-lg px-3 py-2 w-full"
                  value={form.start_time}
                  onChange={(e) => update("start_time", e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  End Time
                </label>
                <input
                  type="time"
                  className="border rounded-lg px-3 py-2 w-full"
                  value={form.end_time}
                  onChange={(e) => update("end_time", e.target.value)}
                />
              </div>
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
                ["show_answers", "Show correct answers to students"],
                ["negative_marking", "Enable negative marking"],
                ["randomize_questions", "Randomize question order"],
                ["randomize_options", "Randomize option order"],
              ].map(([key, label]) => (
                <label
                  key={key}
                  className="flex items-center gap-2 p-3 border rounded-lg hover:bg-slate-50"
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
            disabled={loading}
            className="px-5 py-2 rounded-lg bg-blue-600 text-white
                       hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Exam"}
          </button>
        </div>

      </div>
    </div>
  );
}
