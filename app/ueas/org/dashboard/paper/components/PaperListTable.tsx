"use client";

interface Paper {
  id: string;
  name: string;
  total_questions: number;
  total_marks: number;
  default_duration_minutes: number;
  is_active: number;
  created_at: string;
}

interface Props {
  data: {
    page: number;
    limit: number;
    count: number;
    papers: Paper[];
  } | null;
  loading: boolean;
  onPageChange: (page: number) => void;
}

export default function PaperListTable({
  data,
  loading,
  onPageChange,
}: Props) {
  if (loading) {
    return (
      <div className="p-6 text-sm text-slate-500">
        Loading papers…
      </div>
    );
  }

  if (!data || data.papers.length === 0) {
    return (
      <div className="p-6 text-sm text-slate-500">
        No papers created yet
      </div>
    );
  }

  const { papers, page, limit, count } = data;

  const hasPrev = page > 1;
  const hasNext = page * limit < count;

  return (
    <div className="bg-white border rounded-xl overflow-hidden">

      {/* TABLE */}
      <table className="w-full text-sm">
        <thead className="bg-slate-50 border-b">
          <tr>
            <th className="px-4 py-3 text-left">Paper</th>
            <th className="px-4 py-3 text-center">Questions</th>
            <th className="px-4 py-3 text-center">Marks</th>
            <th className="px-4 py-3 text-center">Duration</th>
            <th className="px-4 py-3 text-center">Status</th>
            <th className="px-4 py-3 text-center">Created</th>
            <th className="px-4 py-3 text-center">Action</th>
          </tr>
        </thead>

        <tbody>
          {papers.map((p) => (
            <tr
              key={p.id}
              className="border-b last:border-b-0 hover:bg-slate-50"
            >
              {/* Paper Name */}
              <td className="px-4 py-3">
                <div className="font-medium text-slate-800">
                  {p.name}
                </div>
                <div className="text-xs text-slate-400">
                  ID: {p.id}
                </div>
              </td>

              {/* Total Questions */}
              <td className="px-4 py-3 text-center">
                {p.total_questions}
              </td>

              {/* Total Marks */}
              <td className="px-4 py-3 text-center">
                {p.total_marks}
              </td>

              {/* Duration */}
              <td className="px-4 py-3 text-center">
                {p.default_duration_minutes} min
              </td>

              {/* Status */}
              <td className="px-4 py-3 text-center">
                {p.is_active === 1 ? (
                  <span className="text-green-600 font-medium">
                    Active
                  </span>
                ) : (
                  <span className="text-slate-500">
                    Inactive
                  </span>
                )}
              </td>

              {/* Created */}
              <td className="px-4 py-3 text-center text-xs text-slate-500">
                {new Date(p.created_at).toLocaleDateString()}
              </td>

              {/* Action */}
              <td className="px-4 py-3 text-center">
                <a
                  href={`/ueas/org/dashboard/paper/${p.id}`}
                  className="text-blue-600 hover:underline text-sm font-medium"
                >
                  Open
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* PAGINATION */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-50 text-sm">
        <span className="text-slate-500">
          Page {page} of {Math.ceil(count / limit)}
        </span>

        <div className="flex gap-2">
          <button
            disabled={!hasPrev}
            onClick={() => onPageChange(page - 1)}
            className="px-3 py-1 rounded border text-sm
                       disabled:opacity-40"
          >
            Previous
          </button>

          <button
            disabled={!hasNext}
            onClick={() => onPageChange(page + 1)}
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
