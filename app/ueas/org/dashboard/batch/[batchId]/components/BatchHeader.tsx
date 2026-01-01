"use client";

export default function BatchHeader({
  batch,
  onAddStudents,
  onBulkUpload,
}: {
  batch: any;
  onAddStudents: () => void;
  onBulkUpload: () => void;
}) {
  return (
    <div className="bg-white border rounded-xl p-6 mb-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {batch.name}
          </h1>

          {batch.description && (
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              {batch.description}
            </p>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={onBulkUpload}
            className="rounded-lg border border-blue-600 text-blue-600
                       px-4 py-2 text-sm font-semibold hover:bg-blue-50"
          >
            📤 Bulk Upload (CSV)
          </button>

          <button
            onClick={onAddStudents}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white
                       text-sm font-semibold"
          >
            + Add Students
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 text-sm">
        <div>
          <span className="text-slate-500">Students</span>
          <div className="font-semibold">
            {batch.total_students ?? 0}
          </div>
        </div>

        <div>
          <span className="text-slate-500">Created</span>
          <div className="font-semibold">
            {new Date(batch.created_at).toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
}
