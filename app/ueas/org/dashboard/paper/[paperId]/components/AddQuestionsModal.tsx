"use client";

import { useEffect, useState } from "react";
import {
  getQuestionsAction,
} from "@/app/actions/ueas/questions.actions";
import {
  addQuestionsToPaperAction,
} from "@/app/actions/ueas/papers.actions";

interface Question {
  id: string;
  question_text: string;
  marks: number;
  difficulty: string;
  subject?: string;
}

export default function AddQuestionsModal({
  open,
  paperId,
  onClose,
  onAdded,
}: {
  open: boolean;
  paperId: string;
  onClose: () => void;
  onAdded: () => void;
}) {
  /* ---------------- FILTERS ---------------- */
  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("");
  const [difficulty, setDifficulty] = useState("");

  /* ---------------- DATA ---------------- */
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  /* ---------------- PAGINATION ---------------- */
  const [page, setPage] = useState(1);
  const limit = 10;
  const [hasNext, setHasNext] = useState(false);

  /* ---------------- LOAD QUESTIONS ---------------- */
  async function loadQuestions(p = 1) {
    setLoading(true);
    try {
      const res = await getQuestionsAction({
        search: search || undefined,
        subject: subject || undefined,
        difficulty:
          difficulty === "easy" ||
          difficulty === "medium" ||
          difficulty === "hard"
            ? difficulty
            : undefined,
        is_published: 1,
        page: p,
        limit,
      });

      setQuestions(res.questions || []);
      setHasNext(res.count === limit);
      setPage(res.page);
    } finally {
      setLoading(false);
    }
  }

  /* ---------------- ADD SELECTED ---------------- */
  async function addSelected() {
    if (selected.length === 0) {
      alert("Select at least one question");
      return;
    }

    setLoading(true);
    try {
      await addQuestionsToPaperAction(paperId, selected);
      onClose();
      onAdded();
    } finally {
      setLoading(false);
    }
  }

  /* ---------------- RESET & LOAD ON OPEN ---------------- */
  useEffect(() => {
    if (open) {
      setSearch("");
      setSubject("");
      setDifficulty("");
      setSelected([]);
      setPage(1);
      loadQuestions(1);
    }
    // eslint-disable-next-line
  }, [open]);

  /* ---------------- RELOAD ON FILTER CHANGE ---------------- */
  useEffect(() => {
    if (open) {
      setPage(1);
      loadQuestions(1);
    }
    // eslint-disable-next-line
  }, [search, subject, difficulty]);

  if (!open) return null;

  const hasPrev = page > 1;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl w-full max-w-6xl h-[80vh] flex flex-col">

        {/* HEADER */}
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">
            Add Questions to Paper
          </h2>
          <button onClick={onClose} className="text-slate-500">✕</button>
        </div>

        {/* FILTERS */}
        <div className="p-4 border-b grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            placeholder="Search question"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm"
          />

          <input
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm"
          />

          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm"
          >
            <option value="">All Difficulty</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        {/* TABLE */}
        <div className="flex-1 overflow-auto">
          {loading ? (
            <div className="p-6 text-sm text-slate-500">
              Loading questions…
            </div>
          ) : questions.length === 0 ? (
            <div className="p-6 text-sm text-slate-500">
              No questions found
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="px-4 py-3"></th>
                  <th className="px-4 py-3 text-left">Question</th>
                  <th className="px-4 py-3 text-center">Marks</th>
                  <th className="px-4 py-3 text-center">Difficulty</th>
                  <th className="px-4 py-3 text-center">Subject</th>
                </tr>
              </thead>
              <tbody>
                {questions.map((q) => (
                  <tr key={q.id} className="border-b hover:bg-slate-50">
                    <td className="px-4 py-3 text-center">
                      <input
                        type="checkbox"
                        checked={selected.includes(q.id)}
                        onChange={() =>
                          setSelected((prev) =>
                            prev.includes(q.id)
                              ? prev.filter((id) => id !== q.id)
                              : [...prev, q.id]
                          )
                        }
                      />
                    </td>

                    <td className="px-4 py-3 max-w-[420px]">
                      <div
                        className="prose prose-sm max-w-none line-clamp-2"
                        dangerouslySetInnerHTML={{ __html: q.question_text }}
                      />
                    </td>

                    <td className="px-4 py-3 text-center">{q.marks}</td>
                    <td className="px-4 py-3 text-center capitalize">
                      {q.difficulty}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {q.subject || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* FOOTER */}
        <div className="px-6 py-4 border-t flex justify-between items-center">
          <span className="text-sm text-slate-500">
            {selected.length} selected
          </span>

          <div className="flex items-center gap-3">
            {/* Pagination */}
            <button
              disabled={!hasPrev || loading}
              onClick={() => loadQuestions(page - 1)}
              className="px-3 py-1 rounded border text-sm disabled:opacity-40"
            >
              Previous
            </button>

            <span className="text-sm text-slate-500">
              Page {page}
            </span>

            <button
              disabled={!hasNext || loading}
              onClick={() => loadQuestions(page + 1)}
              className="px-3 py-1 rounded border text-sm disabled:opacity-40"
            >
              Next
            </button>

            {/* Actions */}
            <button
              onClick={onClose}
              className="ml-4 px-4 py-2 rounded border text-sm"
            >
              Cancel
            </button>

            <button
              onClick={addSelected}
              disabled={loading || selected.length === 0}
              className="px-4 py-2 rounded bg-blue-600 text-white text-sm
                         disabled:opacity-50"
            >
              Add to Paper
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
