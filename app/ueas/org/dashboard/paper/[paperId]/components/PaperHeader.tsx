"use client";

export default function PaperHeader({
  paper,
  onAddQuestions,
  onEditPaper,
}: {
  paper: any;
  onAddQuestions: () => void;
  onEditPaper: () => void;
}) {
  return (
    <div className="bg-white border rounded-xl p-6 mb-6">

      {/* TOP ROW */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            {paper.name}

            {/* STATUS BADGE */}
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-medium
                ${
                  paper.is_active
                    ? "bg-green-100 text-green-700"
                    : "bg-slate-100 text-slate-600"
                }`}
            >
              {paper.is_active ? "Active" : "Inactive"}
            </span>
          </h1>

          {paper.description && (
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              {paper.description}
            </p>
          )}
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-2">
          <button
            onClick={onEditPaper}
            className="rounded-lg border px-3 py-2 text-sm font-medium hover:bg-slate-50"
          >
            ✏️ Edit
          </button>

          <button
            onClick={onAddQuestions}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white text-sm font-semibold"
          >
            + Add Questions
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 text-sm">
        <div>
          <span className="text-slate-500">Questions</span>
          <div className="font-semibold">{paper.total_questions}</div>
        </div>

        <div>
          <span className="text-slate-500">Total Marks</span>
          <div className="font-semibold">{paper.total_marks}</div>
        </div>

        <div>
          <span className="text-slate-500">Duration</span>
          <div className="font-semibold">
            {paper.default_duration_minutes} min
          </div>
        </div>

        <div>
          <span className="text-slate-500">Status</span>
          <div className="font-semibold">
            {paper.is_active ? "Active" : "Inactive"}
          </div>
        </div>
      </div>
    </div>
  );
}
