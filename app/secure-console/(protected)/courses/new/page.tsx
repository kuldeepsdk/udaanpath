import { createCourseAction } from "@/app/actions/admin/courses.action";

export const metadata = {
  title: "Create Course | UdaanPath",
};

export default function CreateCoursePage() {
  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-2xl font-semibold text-slate-800">
        ➕ Create New Course
      </h1>

      <form
        action={createCourseAction}
        className="bg-white rounded-lg shadow p-6 space-y-5"
      >
        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Course Title
          </label>
          <input
            name="title"
            required
            placeholder="e.g. Object Oriented Programming Fundamentals"
            className="w-full border rounded px-3 py-2 text-sm"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Description
          </label>
          <textarea
            name="description"
            rows={4}
            placeholder="Short course description..."
            className="w-full border rounded px-3 py-2 text-sm"
          />
        </div>

        {/* Publish Toggle */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="is_published"
            id="is_published"
          />
          <label htmlFor="is_published" className="text-sm">
            Publish immediately
          </label>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            type="submit"
            className="px-5 py-2 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700"
          >
            Create Course
          </button>

          <a
            href="/secure-console/courses"
            className="px-5 py-2 border text-sm rounded hover:bg-slate-50"
          >
            Cancel
          </a>
        </div>
      </form>
    </div>
  );
}
