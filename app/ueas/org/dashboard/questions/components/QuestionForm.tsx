"use client";

import { useState } from "react";
import { createQuestionAction } from "@/app/actions/ueas/questions.actions";
import SubjectAutocomplete from "./SubjectAutocomplete";
import OptionsEditor from "./OptionsEditor";
import AnalysisEditor from "./AnalysisEditor";
import { INDIAN_LANGUAGES } from "@/lib/constants/languages";
import QuestionEditor from "./QuestionEditor";

/* ================= TYPES ================= */

type QuestionType = "mcq_single" | "mcq_multi";
type Difficulty = "easy" | "medium" | "hard";
type SourceType = "custom" | "book" | "previous_exam" | "online";
type PublishFlag = 0 | 1;

interface QuestionFormState {
  question_text: string;
  question_type: QuestionType;
  difficulty: Difficulty;
  marks: number;
  negative_marks: number;
  subject: string;
  topic: string;
  analysis: string;

  tags: string[];
  estimated_time_sec: number;
  language: string;
  source: SourceType;
  reference_link: string;
  is_published: PublishFlag;

  options: {
    text: string;
    is_correct: boolean;
  }[];
}

/* ================= COMPONENT ================= */

export default function QuestionForm() {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<QuestionFormState>({
    question_text: "",
    question_type: "mcq_single",
    difficulty: "medium",
    marks: 1,
    negative_marks: 0,
    subject: "",
    topic: "",
    analysis: "",

    tags: [],
    estimated_time_sec: 60,
    language: "en",
    source: "custom",
    reference_link: "",
    is_published: 1,

    options: [
      { text: "", is_correct: false },
      { text: "", is_correct: false },
      { text: "", is_correct: false },
      { text: "", is_correct: false },
    ],
  });

  /* ---------------- VALIDATION ---------------- */

  function validate(): string | null {
    if (!form.question_text.trim()) return "Question text is required";

    const filledOptions = form.options.filter(o => o.text.trim());
    if (filledOptions.length < 2) return "At least two options are required";

    const correctCount = filledOptions.filter(o => o.is_correct).length;

    if (form.question_type === "mcq_single" && correctCount !== 1) {
      return "Single correct MCQ must have exactly one correct option";
    }

    if (form.question_type === "mcq_multi" && correctCount < 1) {
      return "Multiple correct MCQ must have at least one correct option";
    }

    return null;
  }

  /* ---------------- SUBMIT ---------------- */

  async function submit() {
    const error = validate();
    if (error) return alert(error);

    setLoading(true);
    try {
      await createQuestionAction(form);
      alert("Question created successfully");
      window.location.href = "/ueas/org/dashboard/questions/create";
    } catch (e: any) {
      alert(e?.message || "Failed to create question");
    } finally {
      setLoading(false);
    }
  }

  /* ================= UI ================= */

  return (
    <div className="bg-white border rounded-xl p-6 space-y-8">

      {/* ================= QUESTION ================= */}
      <div>
        <label className="block text-sm font-semibold mb-2">
          Question
        </label>
        <QuestionEditor
          value={form.question_text}
          onChange={(html) => setForm({ ...form, question_text: html })}
        />
        <p className="text-xs text-slate-500 mt-1">
          Enter the full question text (supports formatting)
        </p>
      </div>

      {/* ================= TYPE & DIFFICULTY ================= */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-1">
            Question Type
          </label>
          <select
            value={form.question_type}
            onChange={(e) =>
              setForm({ ...form, question_type: e.target.value as QuestionType })
            }
            className="w-full rounded-lg border px-3 py-2"
          >
            <option value="mcq_single">MCQ (Single Correct)</option>
            <option value="mcq_multi">MCQ (Multiple Correct)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">
            Difficulty Level
          </label>
          <select
            value={form.difficulty}
            onChange={(e) =>
              setForm({ ...form, difficulty: e.target.value as Difficulty })
            }
            className="w-full rounded-lg border px-3 py-2"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      </div>

      {/* ================= MARKS ================= */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-1">
            Marks
          </label>
          <input
            type="number"
            value={form.marks}
            onChange={(e) => setForm({ ...form, marks: +e.target.value })}
            className="w-full rounded-lg border px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">
            Negative Marks
          </label>
          <input
            type="number"
            step={0.25}
            value={form.negative_marks}
            onChange={(e) =>
              setForm({ ...form, negative_marks: +e.target.value })
            }
            className="w-full rounded-lg border px-3 py-2"
          />
        </div>
      </div>

      {/* ================= SUBJECT & TOPIC ================= */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-1">
            Subject
          </label>
          <SubjectAutocomplete
            value={form.subject}
            onChange={(v) => setForm({ ...form, subject: v })}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">
            Topic / Chapter
          </label>
          <input
            value={form.topic}
            onChange={(e) => setForm({ ...form, topic: e.target.value })}
            className="w-full rounded-lg border px-3 py-2"
          />
        </div>
      </div>

      {/* ================= OPTIONS ================= */}
      <div>
        
        <OptionsEditor
          type={form.question_type}
          options={form.options}
          onChange={(opts) => setForm({ ...form, options: opts })}
        />
      </div>

      {/* ================= ANALYSIS ================= */}
      <div>
        <label className="block text-sm font-semibold mb-2">
          Solution / Explanation
        </label>
        <AnalysisEditor
          value={form.analysis}
          onChange={(v) => setForm({ ...form, analysis: v })}
        />
      </div>

      {/* ================= ADVANCED ================= */}
      <details className="border rounded-xl p-4 bg-slate-50">
        <summary className="cursor-pointer font-semibold text-sm">
          Advanced Settings
        </summary>

        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1">
              Estimated Time (seconds)
            </label>
            <input
              type="number"
              value={form.estimated_time_sec}
              onChange={(e) =>
                setForm({ ...form, estimated_time_sec: +e.target.value })
              }
              className="w-full rounded-lg border px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">
              Tags
            </label>
            <input
              value={form.tags.join(", ")}
              onChange={(e) =>
                setForm({
                  ...form,
                  tags: e.target.value
                    .split(",")
                    .map(t => t.trim())
                    .filter(Boolean),
                })
              }
              className="w-full rounded-lg border px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">
              Question Source
            </label>
            <select
              value={form.source}
              onChange={(e) =>
                setForm({ ...form, source: e.target.value as SourceType })
              }
              className="w-full rounded-lg border px-3 py-2"
            >
              <option value="custom">Custom</option>
              <option value="book">Book</option>
              <option value="previous_exam">Previous Exam</option>
              <option value="online">Online</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">
              Question Language
            </label>
            <select
              value={form.language}
              onChange={(e) =>
                setForm({ ...form, language: e.target.value })
              }
              className="w-full rounded-lg border px-3 py-2"
            >
              {INDIAN_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.label} ({lang.native})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">
              Reference Link
            </label>
            <input
              type="url"
              value={form.reference_link}
              onChange={(e) =>
                setForm({ ...form, reference_link: e.target.value })
              }
              className="w-full rounded-lg border px-3 py-2"
            />
          </div>

          <label className="flex items-center gap-2 text-sm font-medium">
            <input
              type="checkbox"
              checked={form.is_published === 1}
              onChange={(e) =>
                setForm({ ...form, is_published: e.target.checked ? 1 : 0 })
              }
            />
            Publish immediately
          </label>
        </div>
      </details>

      {/* ================= SUBMIT ================= */}
      <button
        disabled={loading}
        onClick={submit}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg"
      >
        {loading ? "Saving..." : "Save Question"}
      </button>
    </div>
  );
}
