import { fetchAdminChapters } from "@/app/actions/admin/courses.action";

export default async function ChaptersPage(props: {
  params: Promise<{ courseId: string }>;
}) {
  // ✅ Next.js 16 fix
  const params = await props.params;
  const courseId = Number(params.courseId);

  if (!courseId) {
    return (
      <div className="p-6 text-red-600">
        Invalid course ID
      </div>
    );
  }

  const chapters = await fetchAdminChapters(courseId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">
            📘 Chapters
          </h1>
          <p className="text-sm text-gray-500">
            Manage chapters and lesson content
          </p>
        </div>

        <a
          href={`/secure-console/courses/${courseId}/chapters/new`}
          className="px-4 py-2 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700"
        >
          + Add Chapter
        </a>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow border">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100 border-b">
            <tr>
              <th className="px-4 py-3 text-center w-20">
                Order
              </th>
              <th className="px-4 py-3 text-left">
                Chapter Title
              </th>
              <th className="px-4 py-3 text-center w-24">
                Status
              </th>
              <th className="px-4 py-3 text-right w-40">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {chapters.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-8 text-center text-gray-500"
                >
                  No chapters created yet
                </td>
              </tr>
            )}

            {chapters.map((ch: any) => (
              <tr
                key={ch.uuid}
                className="border-t hover:bg-slate-50"
              >
                {/* Order */}
                <td className="px-4 py-2 text-center font-mono">
                  {ch.order}
                </td>

                {/* Title */}
                <td className="px-4 py-2">
                  <div className="font-medium text-slate-800">
                    {ch.title}
                  </div>
                </td>

                {/* Status */}
                <td className="px-4 py-2 text-center">
                  {ch.is_published ? (
                    <span className="text-green-600">Published</span>
                  ) : (
                    <span className="text-gray-400">Draft</span>
                  )}
                </td>

                {/* Actions */}
                <td className="px-4 py-2 text-right">
                  <a
                    href={`/secure-console/courses/${courseId}/chapters/${ch.uuid}/edit`}
                    className="inline-flex items-center gap-1 text-indigo-600 hover:underline"
                  >
                    ✏️ Edit
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
