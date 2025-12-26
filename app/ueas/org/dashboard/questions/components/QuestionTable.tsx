"use client";

interface Question {
  id: string;
  question_text: string; // HTML
  question_type: string;
  marks: string | number;
  difficulty: string;
  subject?: string;
  topic?: string;
  language?: string;
  is_published: 0 | 1;
  created_at: string;
}

interface Props {
  data: {
    page: number;
    limit: number;
    count: number;
    questions: Question[];
  } | null;
  loading: boolean;
  onPageChange?: (page: number) => void;
}

export default function QuestionTable({
  data,
  loading,
  onPageChange,
}: Props) {
  if (loading) {
    return <div className="p-6 text-sm text-slate-500">Loading questions…</div>;
  }

  if (!data || data.questions.length === 0) {
    return (
      <div className="p-6 text-sm text-slate-500">
        No questions found
      </div>
    );
  }

  const { questions, page, limit, count } = data;
  const hasPrev = page > 1;
  const hasNext = count === limit; // backend already limits results

  return (
    <div className="bg-white border rounded-xl overflow-hidden">

      {/* TABLE */}
      <table className="w-full text-sm">
        <thead className="bg-slate-50 border-b">
          <tr>
            <th className="px-4 py-3 text-left">Question</th>
            <th className="px-4 py-3 text-center">Type</th>
            <th className="px-4 py-3 text-center">Marks</th>
            <th className="px-4 py-3 text-center">Difficulty</th>
            <th className="px-4 py-3 text-center">Subject</th>
            <th className="px-4 py-3 text-center">Language</th>
            <th className="px-4 py-3 text-center">Status</th>
            <th className="px-4 py-3 text-center">Created</th>
          </tr>
        </thead>

        <tbody>
          {questions.map((q) => (
            <tr
              key={q.id}
              className="border-b last:border-b-0 hover:bg-slate-50"
            >
              {/* Question Text */}
              <td className="px-4 py-3 max-w-[420px]">
                <div
                  className="prose prose-sm max-w-none line-clamp-3"
                  dangerouslySetInnerHTML={{ __html: q.question_text }}
                />
                {q.topic && (
                  <div className="mt-1 text-xs text-slate-400">
                    Topic: {q.topic}
                  </div>
                )}
              </td>

              {/* Type */}
              <td className="px-4 py-3 text-center">
                {q.question_type === "mcq_single"
                  ? "MCQ (Single)"
                  : "MCQ (Multiple)"}
              </td>

              {/* Marks */}
              <td className="px-4 py-3 text-center">
                {q.marks}
              </td>

              {/* Difficulty */}
              <td className="px-4 py-3 text-center capitalize">
                {q.difficulty}
              </td>

              {/* Subject */}
              <td className="px-4 py-3 text-center">
                {q.subject || "-"}
              </td>

              {/* Language */}
              <td className="px-4 py-3 text-center uppercase">
                {q.language || "en"}
              </td>

              {/* Status */}
              <td className="px-4 py-3 text-center">
                {q.is_published === 1 ? (
                  <span className="text-green-600 font-medium">
                    Published
                  </span>
                ) : (
                  <span className="text-slate-500">
                    Draft
                  </span>
                )}
              </td>

              {/* Created */}
              <td className="px-4 py-3 text-center text-xs text-slate-500">
                {new Date(q.created_at).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* PAGINATION */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-50 text-sm">
        <span className="text-slate-500">
          Page {page}
        </span>

        <div className="flex gap-2">
          <button
            disabled={!hasPrev}
            onClick={() => onPageChange?.(page - 1)}
            className="px-3 py-1 rounded border text-sm
                       disabled:opacity-40"
          >
            Previous
          </button>

          <button
            disabled={!hasNext}
            onClick={() => onPageChange?.(page + 1)}
            className="px-3 py-1 rounded border text-sm
                       disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>

    </div>
  );
}
