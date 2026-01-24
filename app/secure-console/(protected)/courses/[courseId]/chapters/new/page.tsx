import { createChapterAction } from "@/app/actions/admin/courses.action";

export default async function NewChapterPage(props: {
  params: Promise<{ courseId: string }>;
}) {
  const params = await props.params;
  const courseId = params.courseId;

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">
          ➕ Add New Chapter
        </h1>
        <p className="text-sm text-slate-500">
          Create a new chapter for Course #{courseId}
        </p>
      </div>

      {/* Form */}
      <form
        action={createChapterAction}
        className="bg-white rounded-xl shadow border p-6 space-y-6"
      >
        <input type="hidden" name="course_id" value={courseId} />

        {/* Chapter Title */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Chapter Title
          </label>
          <input
            name="title"
            required
            placeholder="e.g. Introduction to Variables"
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        {/* Order */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Chapter Order
          </label>
          <input
            name="order_no"
            type="number"
            min={1}
            placeholder="1"
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
          <p className="text-xs text-slate-500 mt-1">
            Determines the sequence of chapters in the course
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t">
          <a
            href={`/secure-console/courses/${courseId}/chapters`}
            className="px-4 py-2 border rounded hover:bg-slate-50"
          >
            Cancel
          </a>

          <button
            type="submit"
            className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            🚀 Create Chapter
          </button>
        </div>
      </form>
    </div>
  );
}
