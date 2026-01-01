"use client";

import { useEffect, useState } from "react";
import QuestionFilters from "./components/QuestionFilters";
import QuestionTable from "./components/QuestionTable";
import { getQuestionsAction } from "@/app/actions/ueas/questions.actions";
import type { QuestionListFilters } from "@/app/actions/ueas/questions.actions";

/* ---------------- Utils ---------------- */

function normalizeDifficulty(
  value: string
): "easy" | "medium" | "hard" | undefined {
  if (value === "easy" || value === "medium" || value === "hard") {
    return value;
  }
  return undefined;
}

/* ---------------- Page ---------------- */

export default function QuestionsPage() {
  /* ---------- FILTER STATE ---------- */
  const [filters, setFilters] = useState<{
    search: string;
    subject: string;
    difficulty: string;
    is_published?: 0 | 1;
  }>({
    search: "",
    subject: "",
    difficulty: "",
    is_published: undefined,
  });

  /* ---------- PAGINATION STATE ---------- */
  const [page, setPage] = useState(1);
  const limit = 20;

  /* ---------- DATA STATE ---------- */
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  /* ---------- LOAD QUESTIONS ---------- */
  async function loadQuestions(currentPage: number) {
    setLoading(true);

    try {
      const payload: QuestionListFilters = {
        search: filters.search || undefined,
        subject: filters.subject || undefined,
        difficulty: normalizeDifficulty(filters.difficulty),
        is_published: filters.is_published,
        page: currentPage,
        limit,
      };

      const res = await getQuestionsAction(payload);
      setData(res);
    } finally {
      setLoading(false);
    }
  }

  /* ---------- Reload on filter change ---------- */
  useEffect(() => {
    setPage(1);            // 🔑 reset page on filter change
    loadQuestions(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  /* ---------- Pagination handler ---------- */
  function handlePageChange(newPage: number) {
    setPage(newPage);
    loadQuestions(newPage);
  }

  return (
    <>
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          Question Bank
        </h1>

        <a
          href="/ueas/org/dashboard/questions/create"
          className="rounded-lg bg-blue-600 px-4 py-2 text-white text-sm font-semibold"
        >
          + Add Question
        </a>
      </div>

      {/* FILTERS */}
      <QuestionFilters
        value={filters}
        onChange={setFilters}
      />

      {/* TABLE */}
      <QuestionTable
        data={data}
        loading={loading}
        onPageChange={handlePageChange}
      />
    </>
  );
}
