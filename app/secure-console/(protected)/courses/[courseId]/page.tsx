import {
  fetchAdminCourse,
  updateCourseAction,
  fetchStudyCategories,
  fetchCourseCategories,
  updateCourseCategoriesAction,
} from "@/app/actions/admin/courses.action";

export default async function EditCoursePage(props: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await props.params;
  const id = Number(courseId);

  const course = await fetchAdminCourse(id);
  if (!course) {
    return (
      <div className="p-6 text-red-600">
        Course not found
      </div>
    );
  }

  const allCategories = await fetchStudyCategories();
  const selectedCategories = await fetchCourseCategories(id);

  const selectedIds = new Set(
    selectedCategories.map((c: any) => c.id)
  );

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      {/* ================= HEADER ================= */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">
          ✏️ Edit Course
        </h1>
        <p className="text-sm text-slate-500">
          Update course details and categories
        </p>
      </div>

      {/* ================= COURSE META ================= */}
      <form
        action={updateCourseAction.bind(null, id)}
        className="bg-white rounded-xl shadow border p-6 space-y-6"
      >
        <h2 className="text-lg font-medium text-slate-800">
          📘 Course Details
        </h2>

        <div>
          <label className="block text-sm font-medium mb-1">
            Course Title
          </label>
          <input
            name="title"
            defaultValue={course.title}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Slug
          </label>
          <input
            name="slug"
            defaultValue={course.slug}
            className="w-full border rounded px-3 py-2 font-mono"
            required
          />
          <p className="text-xs text-slate-500 mt-1">
            Used in URL: /courses/{course.slug}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Description
          </label>
          <textarea
            name="description"
            rows={5}
            defaultValue={course.description || ""}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="is_published"
            defaultChecked={course.is_published}
          />
          <label className="text-sm">
            Published
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <button className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
            💾 Save Course
          </button>
        </div>
      </form>

      {/* ================= COURSE CATEGORIES ================= */}
      <form
        id="categories"
        action={updateCourseCategoriesAction.bind(null, id)}
        className="bg-white rounded-xl shadow border p-6 space-y-6"
      >
        <h2 className="text-lg font-medium text-slate-800">
          🗂 Course Categories
        </h2>

        <p className="text-sm text-slate-500">
          Select one or more categories for this course
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {allCategories.map((cat: any) => (
            <label
              key={cat.id}
              className="flex items-center gap-3 p-3 border rounded hover:bg-slate-50 cursor-pointer"
            >
              <input
                type="checkbox"
                name="category_ids"
                value={cat.id}
                defaultChecked={selectedIds.has(cat.id)}
              />
              <span className="text-sm">
                {cat.name}
              </span>
            </label>
          ))}
        </div>

        <div className="flex justify-between pt-4 border-t">
          <a
            href="/secure-console/courses"
            className="px-4 py-2 border rounded"
          >
            ← Back to Courses
          </a>

          <button className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
            💾 Save Categories
          </button>
        </div>
      </form>
    </div>
  );
}
