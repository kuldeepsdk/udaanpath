"use client";

import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { getQuestionSubjectsAction } from "@/app/actions/ueas/questions.actions";

interface FilterValue {
  search: string;
  subject: string;
  difficulty: string;
  is_published?: 0 | 1;
}

interface Props {
  value: FilterValue;
  onChange: (v: FilterValue) => void;
}

export default function QuestionFilters({ value, onChange }: Props) {
  const [subjects, setSubjects] = useState<string[]>([]);
  const [loadingSubjects, setLoadingSubjects] = useState(true);

  /* ---------------- Load Subjects ---------------- */

  useEffect(() => {
    let mounted = true;

    async function loadSubjects() {
      try {
        const data = await getQuestionSubjectsAction();
        if (mounted) setSubjects(data);
      } catch {
        if (mounted) setSubjects([]);
      } finally {
        if (mounted) setLoadingSubjects(false);
      }
    }

    loadSubjects();

    return () => {
      mounted = false;
    };
  }, []);

  /* ---------------- UI ---------------- */

  return (
    <div className="bg-white border rounded-2xl p-5 mb-6 shadow-sm">

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-800">
          Filter Questions
        </h3>

        <button
          type="button"
          className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700"
          onClick={() =>
            onChange({
              search: "",
              subject: "",
              difficulty: "",
              is_published: undefined,
            })
          }
        >
          <X className="h-3.5 w-3.5" />
          Clear
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Search */}
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            Search
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              value={value.search}
              onChange={(e) =>
                onChange({ ...value, search: e.target.value })
              }
              placeholder="Search question text"
              className="w-full rounded-lg border pl-9 pr-3 py-2 text-sm
                         focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Subject (Dynamic) */}
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            Subject
          </label>
          <select
            value={value.subject}
            disabled={loadingSubjects}
            onChange={(e) =>
              onChange({ ...value, subject: e.target.value })
            }
            className="w-full rounded-lg border px-3 py-2 text-sm bg-white
                       disabled:bg-slate-50 disabled:text-slate-400
                       focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            {loadingSubjects ? (
              <option>Loading subjects...</option>
            ) : subjects.length === 0 ? (
              <option value="">No subjects available</option>
            ) : (
              <>
                <option value="">All Subjects</option>
                {subjects.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </>
            )}
          </select>
        </div>

        {/* Difficulty */}
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            Difficulty
          </label>
          <select
            value={value.difficulty}
            onChange={(e) =>
              onChange({ ...value, difficulty: e.target.value })
            }
            className="w-full rounded-lg border px-3 py-2 text-sm bg-white
                       focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">All Levels</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            Status
          </label>
          <select
            value={value.is_published ?? ""}
            onChange={(e) =>
              onChange({
                ...value,
                is_published:
                  e.target.value === ""
                    ? undefined
                    : (Number(e.target.value) as 0 | 1),
              })
            }
            className="w-full rounded-lg border px-3 py-2 text-sm bg-white
                       focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">All</option>
            <option value="1">Published</option>
            <option value="0">Draft</option>
          </select>
        </div>

      </div>
    </div>
  );
}
