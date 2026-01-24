import { fetchAdminChapters,fetchChapterContent,
  saveChapterContentAction,updateChapterMetaAction } from "@/app/actions/admin/courses.action";


export default async function UnifiedChapterEditPage(props: {
  params: Promise<{ courseId: string; chapterUuid: string }>;
}) {
  const { courseId, chapterUuid } = await props.params;

  const chapters = await fetchAdminChapters(Number(courseId));
  const chapter = chapters.find((c: any) => c.uuid === chapterUuid);

  if (!chapter) {
    return (
      <div className="p-6 text-red-600">
        Chapter not found
      </div>
    );
  }

  const content = await fetchChapterContent(chapterUuid);

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">
            ✏️ Edit Chapter
          </h1>
          <p className="text-sm text-slate-500">
            Update chapter settings and lesson content
          </p>
        </div>

        <a
          href={`/secure-console/courses/${courseId}/chapters`}
          className="px-4 py-2 border rounded hover:bg-slate-50"
        >
          ← Back to Chapters
        </a>
      </div>

      {/* ================= CHAPTER META ================= */}
      <form
        action={updateChapterMetaAction.bind(null, chapterUuid)}
        className="bg-white rounded-xl shadow border p-6 space-y-4"
      >
        <h2 className="text-lg font-medium text-slate-800">
          📘 Chapter Settings
        </h2>

        <div>
          <label className="block text-sm mb-1">
            Chapter Title
          </label>
          <input
            name="title"
            defaultValue={chapter.title}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">
              Order
            </label>
            <input
              type="number"
              name="order"
              defaultValue={chapter.order}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div className="flex items-center gap-2 mt-6">
            <input
              type="checkbox"
              name="is_published"
              defaultChecked={chapter.is_published}
            />
            <label className="text-sm">
              Published
            </label>
          </div>
        </div>

        <div className="text-right">
          <button className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
            💾 Save Chapter Settings
          </button>
        </div>
      </form>

      {/* ================= CHAPTER CONTENT ================= */}
      <form
        action={saveChapterContentAction.bind(null, chapterUuid)}
        className="bg-white rounded-xl shadow border"
      >
        {/* Content */}
        <div className="p-6 border-b space-y-3">
          <h2 className="text-lg font-medium text-slate-800">
            📝 Lesson Content
          </h2>

          <textarea
            name="content_html"
            rows={16}
            defaultValue={content?.content_html || ""}
            className="w-full border rounded-lg px-4 py-3 font-mono text-sm"
            placeholder="<h2>Introduction</h2>..."
          />
        </div>

        {/* Video */}
        <div className="p-6 border-b space-y-3">
          <label className="block text-sm">
            🎥 Video URL (optional)
          </label>
          <input
            name="video_url"
            type="url"
            defaultValue={content?.video_url || ""}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Notes */}
        <div className="p-6 space-y-3">
          <label className="block text-sm">
            📄 Notes PDF URL (optional)
          </label>
          <input
            name="notes_pdf"
            type="url"
            defaultValue={content?.notes_pdf || ""}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Actions */}
        <div className="border-t bg-slate-50 px-6 py-4 flex justify-end">
          <button className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
            💾 Save Lesson Content
          </button>
        </div>
      </form>
    </div>
  );
}
