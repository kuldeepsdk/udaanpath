//app\ueas\exam\[examId]\components\ExamQuestionRunner.tsx

"use client";

import { useEffect, useState, useRef } from "react";

import { seededShuffle } from "@/lib/seededShuffle";
import { getStudentExamSummaryAction } from "@/app/actions/ueas/exam/getExamSummary.actions";
import {
  startExamAction,
  autosaveAnswerAction,
  submitExamAction,
} from "@/app/actions/ueas/exam/runtime.actions";

interface Props {
  examId: string;
  examEndAt: Date;
   exam: any;
}

export default function ExamQuestionRunner({
  examId,
  examEndAt,  
  exam
}: Props) {
  const [questions, setQuestions] = useState<any[]>([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [showResult, setShowResult] = useState(false);
const [result, setResult] = useState<{
  obtained: number;
  total: number;
} | null>(null);

  const autoSubmittedRef = useRef(false);

  /* ---------- SESSION ---------- */
  const token =
    typeof window !== "undefined"
      ? sessionStorage.getItem("exam_student_token")
      : null;

  if (!token) {
    return (
      <div className="text-center text-sm text-red-600 mt-10">
        Session expired. Please login again.
      </div>
    );
  }

  /* ---------- START EXAM ---------- */
  useEffect(() => {
    let mounted = true;

    async function startExam() {
      try {
        const res = await startExamAction({
          exam_id: examId,
          token: token!,
        });

        if (mounted) {
          const rawQuestions = res.questions || [];
          const seed = token!;

          // 1️⃣ Question Shuffle
          let finalQuestions = exam.randomize_questions
            ? seededShuffle(rawQuestions, seed)
            : rawQuestions;

          // 2️⃣ Option Shuffle (per question)
          finalQuestions = finalQuestions.map((q: any) => ({
            ...q,
            options: exam.randomize_options
              ? seededShuffle(q.options || [], seed + q.id)
              : q.options,
          }));

          if (mounted) {
            setQuestions(finalQuestions);
          }

        }
      } catch (e: any) {
        alert(e.message || "Failed to start exam");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    startExam();
    return () => {
      mounted = false;
    };
  }, [examId, token]);

  /* ---------- TIMER ---------- */
  useEffect(() => {
    const tick = () => {
      const diff = examEndAt.getTime() - Date.now();
      setTimeLeft(Math.max(0, diff));
    };

    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [examEndAt]);

  /* ---------- AUTO SUBMIT ---------- */
  useEffect(() => {
    if (
      timeLeft <= 0 &&
      questions.length > 0 &&
      !autoSubmittedRef.current
    ) {
      autoSubmittedRef.current = true;
      handleSubmit();
    }
  }, [timeLeft, questions.length]);

  /* ---------- LOADING ---------- */
  if (loading) {
    return (
      <div className="text-center text-sm text-slate-600 py-10">
        Loading exam…
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="text-center text-sm text-red-600 py-10">
        No questions found for this exam
      </div>
    );
  }

  const q = questions[current];
  const selected = answers[q.id] || [];

  const minutes = Math.floor(timeLeft / 60000);
  const seconds = Math.floor((timeLeft % 60000) / 1000);

  const progress =
    ((current + 1) / questions.length) * 100;

  /* ---------- OPTION SELECT ---------- */
  async function selectOption(optId: string) {
    let updated: string[];

    if (q.question_type === "mcq_single") {
      updated = [optId];
    } else {
      updated = selected.includes(optId)
        ? selected.filter((x) => x !== optId)
        : [...selected, optId];
    }

    setAnswers((prev) => ({
      ...prev,
      [q.id]: updated,
    }));

    try {
      await autosaveAnswerAction({
        exam_id: examId,
        question_id: q.id,
        selected_options: updated,
        token: token!,
      });
    } catch {
      // autosave silently fails
    }
  }

  /* ---------- SUBMIT ---------- */
  async function handleSubmit() {
  if (submitting) return;

  setSubmitting(true);

  try {
    await submitExamAction({
      exam_id: examId,
      token: token!,
    });

    // 🔐 Clear exam session immediately
    sessionStorage.removeItem("exam_student_token");

    // 🅱️ SHOW SCORE CASE
    if (exam.show_answers) {
      const summary = await getStudentExamSummaryAction({
        exam_id: examId,
        token: token!,
      });

      setResult(summary);
      setShowResult(true);

      // ⏳ Auto reload after 2 minutes
      setTimeout(() => {
        window.location.reload();
      }, 2 * 60 * 1000);

      return;
    }

    // 🅰️ NO SCORE CASE
    alert("Exam submitted successfully");
    window.location.reload();

  } catch (e: any) {
    alert(e.message || "Failed to submit exam");
  } finally {
    setSubmitting(false);
  }
}

if (showResult && result) {
  return (
    <div className="max-w-md mx-auto bg-white border rounded-xl p-6 text-center space-y-4">
      <div className="text-4xl">🎉</div>

      <h2 className="text-xl font-semibold">
        Exam Completed
      </h2>

      <p className="text-sm text-slate-600">
        Your score
      </p>

      <div className="text-3xl font-bold text-green-700">
        {result.obtained} / {result.total}
      </div>

      <p className="text-xs text-slate-500">
        This page will refresh automatically in 2 minutes.
      </p>
    </div>
  );
}


  return (
    <div className="max-w-3xl mx-auto space-y-4">

      {/* ---------- HEADER ---------- */}
      <div className="sticky top-0 bg-white z-10 border-b pb-3">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-sm">
            Question {current + 1} / {questions.length}
          </h2>

          <span
            className={`font-mono text-sm ${
              timeLeft < 5 * 60 * 1000
                ? "text-red-600"
                : "text-slate-700"
            }`}
          >
            ⏳ {minutes}:{seconds.toString().padStart(2, "0")}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="mt-2 h-1 bg-slate-200 rounded">
          <div
            className="h-1 bg-blue-600 rounded transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* ---------- QUESTION CARD ---------- */}
      <div className="border rounded-xl p-5 space-y-4 bg-white shadow-sm">
        <div
          className="font-medium leading-relaxed"
          dangerouslySetInnerHTML={{ __html: q.question_text }}
        />

        <div className="space-y-2">
          {q.options.map((opt: any) => {
            const checked = selected.includes(opt.id);

            return (
              <label
                key={opt.id}
                className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer
                  ${
                    checked
                      ? "border-blue-600 bg-blue-50"
                      : "border-slate-200 hover:bg-slate-50"
                  }
                `}
              >
                <input
                  type={
                    q.question_type === "mcq_single"
                      ? "radio"
                      : "checkbox"
                  }
                  checked={checked}
                  onChange={() => selectOption(opt.id)}
                  className="mt-1"
                />
                <span className="text-sm">
                  {opt.option_text}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* ---------- FOOTER NAV ---------- */}
      <div className="flex justify-between items-center pt-2">
        <button
          disabled={current === 0}
          onClick={() => setCurrent((c) => c - 1)}
          className="px-4 py-2 border rounded-lg text-sm disabled:opacity-50"
        >
          Previous
        </button>

        {current < questions.length - 1 ? (
          <button
            onClick={() => setCurrent((c) => c + 1)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-6 py-2 bg-green-600 text-white rounded-lg text-sm disabled:opacity-60"
          >
            {submitting ? "Submitting…" : "Submit Exam"}
          </button>
        )}
      </div>
    </div>
  );
}
