import {
  fetchChapterContent,
  saveChapterContentAction,
} from "@/app/actions/admin/courses.action";

export default async function ChapterContentPage(props: {
  params: Promise<{ courseId: string; chapterUuid: string }>;
}) {
  const { chapterUuid } = await props.params;
  const content = await fetchChapterContent(chapterUuid);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">
            📝 Chapter Content
          </h1>
          <p className="text-sm text-slate-500">
            Manage lesson content, video and notes
          </p>
        </div>

        <a
          href="../"
          className="text-sm px-4 py-2 border rounded hover:bg-slate-50"
        >
          ← Back to Chapters
        </a>
      </div>

      {/* Form */}
      <form
        action={saveChapterContentAction.bind(null, chapterUuid)}
        className="bg-white rounded-xl shadow border"
      >
        {/* ================= CONTENT ================= */}
        <div className="p-6 border-b space-y-3">
          <h2 className="text-lg font-medium text-slate-800">
            📘 Lesson Content
          </h2>
          <p className="text-sm text-slate-500">
            Write HTML content shown to students (you can paste from editor)
          </p>

          <textarea
            name="content_html"
            rows={16}
            defaultValue={content?.content_html || ""}
            required
            className="w-full border rounded-lg px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            placeholder="<h2>Introduction</h2>..."
          />
        </div>

        {/* ================= VIDEO ================= */}
        <div className="p-6 border-b space-y-3">
          <h2 className="text-lg font-medium text-slate-800">
            🎥 Video Resource
          </h2>
          <p className="text-sm text-slate-500">
            Optional YouTube / Vimeo / hosted video URL
          </p>

          <input
            name="video_url"
            type="url"
            defaultValue={content?.video_url || ""}
            placeholder="https://www.youtube.com/watch?v=..."
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        {/* ================= NOTES ================= */}
        <div className="p-6 space-y-3">
          <h2 className="text-lg font-medium text-slate-800">
            📄 Notes / PDF
          </h2>
          <p className="text-sm text-slate-500">
            Optional PDF or document link for students
          </p>

          <input
            name="notes_pdf"
            type="url"
            defaultValue={content?.notes_pdf || ""}
            placeholder="https://example.com/notes.pdf"
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        {/* ================= ACTION BAR ================= */}
        <div className="sticky bottom-0 bg-slate-50 border-t px-6 py-4 flex justify-end gap-3 rounded-b-xl">
          <a
            href="../"
            className="px-4 py-2 border rounded hover:bg-white"
          >
            Cancel
          </a>

          <button
            type="submit"
            className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            💾 Save Content
          </button>
        </div>
      </form>
    </div>
  );
}
