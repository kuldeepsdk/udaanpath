import { fetchAdminCourses } from "@/app/actions/admin/courses.action";

export const metadata = {
  title: "Manage Courses | UdaanPath",
};

export default async function CoursesPage(props: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const searchParams = await props.searchParams;

  const q =
    typeof searchParams.q === "string" ? searchParams.q : "";

  const page =
    typeof searchParams.page === "string"
      ? parseInt(searchParams.page, 10)
      : 1;

  const { data: courses, pagination } =
    await fetchAdminCourses({ page, q });

  return (
    <div className="space-y-6">
      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-800">
          🎓 Courses
        </h1>

        <a
          href="/secure-console/courses/new"
          className="px-4 py-2 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700"
        >
          + Add Course
        </a>
      </div>

      {/* ================= SEARCH ================= */}
      <form className="flex gap-2">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Search by title or slug..."
          className="w-72 px-3 py-2 border rounded text-sm"
        />
        <button className="px-4 py-2 bg-slate-800 text-white text-sm rounded">
          Search
        </button>
      </form>

      {/* ================= TABLE ================= */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-4 py-3 text-left">Title</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Categories</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {courses.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-6 text-center text-slate-500"
                >
                  No courses found
                </td>
              </tr>
            )}

            {courses.map((course: any) => (
              <tr
                key={course.id}
                className="border-t hover:bg-slate-50 align-top"
              >
                {/* Title */}
                <td className="px-4 py-3 font-medium">
                  {course.title}
                </td>

                {/* Slug */}
                <td className="px-4 py-3 text-slate-600">
                  {course.slug}
                </td>

                {/* Categories */}
                <td className="px-4 py-3">
                  {course.categories?.length ? (
                    <div className="flex flex-wrap gap-1">
                      {course.categories.map((cat: any) => (
                        <span
                          key={cat.id}
                          className="px-2 py-0.5 text-xs rounded bg-indigo-50 text-indigo-700"
                        >
                          {cat.name}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400">
                      Not assigned
                    </span>
                  )}
                </td>

                {/* Status */}
                <td className="px-4 py-3 text-center">
                  {course.is_published ? (
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">
                      Published
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded">
                      Draft
                    </span>
                  )}
                </td>

                {/* Actions */}
                <td className="px-4 py-3 text-right space-x-3 whitespace-nowrap">
                  <a
                    href={`/secure-console/courses/${course.id}`}
                    className="text-indigo-600 hover:underline"
                  >
                    Edit
                  </a>

                  <a
                    href={`/secure-console/courses/${course.id}/chapters`}
                    className="text-slate-600 hover:underline"
                  >
                    Chapters
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= PAGINATION ================= */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-end gap-2 text-sm">
          {Array.from(
            { length: pagination.totalPages },
            (_, i) => i + 1
          ).map((p) => (
            <a
              key={p}
              href={`/secure-console/courses?page=${p}&q=${q}`}
              className={`px-3 py-1 rounded border ${
                p === pagination.page
                  ? "bg-indigo-600 text-white"
                  : "bg-white hover:bg-slate-100"
              }`}
            >
              {p}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
