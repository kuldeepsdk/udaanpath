import Link from "next/link";
import { fetchCourseDetail } from "@/app/actions/courses.actions";

export default async function CourseDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ courseSlug: string }>;
  searchParams: Promise<{ chapter?: string }>;
}) {
  const { courseSlug } = await params;
  const { chapter } = await searchParams;

  const response = await fetchCourseDetail(courseSlug, chapter);
  const { course, chapters, currentChapter, chapterContent } = response;

  const currentIndex = chapters.findIndex(
    (c: any) => c.uuid === currentChapter?.uuid
  );

  const prevChapter = chapters[currentIndex - 1];
  const nextChapter = chapters[currentIndex + 1];

  return (
    <div className="bg-slate-50 min-h-screen relative">

      {/* =====================
         HERO HEADER
      ====================== */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-10 grid md:grid-cols-12 gap-6 items-center">
          {course.thumbnail_base64 && (
            <div className="md:col-span-4">
              <img
                src={
                  course.thumbnail_base64.startsWith("data:image")
                    ? course.thumbnail_base64
                    : `data:image/png;base64,${course.thumbnail_base64}`
                }
                alt={course.title}
                className="rounded-2xl shadow-md w-full object-cover"
              />
            </div>
          )}

          <div className="md:col-span-8 space-y-3">
            <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
              Free Course
            </span>

            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
              {course.title}
            </h1>

            {course.description && (
              <p className="text-slate-600 max-w-3xl">
                {course.description}
              </p>
            )}

            <div className="flex items-center gap-4 text-sm text-slate-500">
              <span>📚 {chapters.length} Chapters</span>
              <span>🎓 Self-paced learning</span>
            </div>
          </div>
        </div>
      </section>

      {/* =====================
         FLOATING CHAPTER BUTTON
      ====================== */}
      <a
        href="#chapters"
        className="fixed top-28 left-4 z-40 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl shadow-lg text-sm font-semibold"
      >
        📚 Chapters
      </a>

      {/* =====================
         MAIN CONTENT (FULL WIDTH)
      ====================== */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <main>
          <div className="bg-white rounded-2xl border shadow-sm p-6 min-h-[500px]">

            <h2 className="text-2xl font-semibold text-slate-900 mb-4">
              {currentChapter?.title}
            </h2>

            {chapterContent?.video_url && (
              <div className="mb-6 aspect-video rounded-xl overflow-hidden border">
                <iframe
                  src={chapterContent.video_url}
                  className="w-full h-full"
                  allowFullScreen
                />
              </div>
            )}

            {chapterContent?.content_html ? (
              <div
                className="prose max-w-none prose-slate"
                dangerouslySetInnerHTML={{
                  __html: chapterContent.content_html,
                }}
              />
            ) : (
              <p className="text-slate-500">
                No content available for this chapter.
              </p>
            )}

            {chapterContent?.notes_pdf && (
              <div className="mt-8">
                <a
                  href={chapterContent.notes_pdf}
                  target="_blank"
                  className="inline-flex items-center text-blue-600 font-medium hover:underline"
                >
                  📄 Download Notes (PDF)
                </a>
              </div>
            )}

            {/* Chapter Navigation */}
            <div className="mt-10 flex justify-between gap-4">
              {prevChapter ? (
                <Link
                  href={`?chapter=${prevChapter.uuid}`}
                  className="px-5 py-3 rounded-xl border bg-white hover:bg-slate-50 text-sm"
                >
                  ← Previous
                </Link>
              ) : <div />}

              {nextChapter && (
                <Link
                  href={`?chapter=${nextChapter.uuid}`}
                  className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm"
                >
                  Next →
                </Link>
              )}
            </div>

          </div>
        </main>
      </section>

      {/* =====================
         OFF-CANVAS CHAPTER SIDEBAR (PURE CSS)
      ====================== */}
      <aside
        id="chapters"
        className="fixed top-0 left-0 h-full w-[320px] bg-white shadow-xl z-50 transform -translate-x-full target:translate-x-0 transition-transform duration-300 overflow-y-auto"
      >
        <div className="px-5 py-4 border-b flex justify-between items-center">
          <h3 className="font-semibold text-slate-800">
            Course Chapters
          </h3>
          <a href="#" className="text-slate-500 hover:text-slate-800">
            ✕
          </a>
        </div>

        <ul className="divide-y">
          {chapters.map((ch: any, index: number) => {
            const active = ch.uuid === currentChapter?.uuid;

            return (
              <li key={ch.uuid}>
                <Link
                  href={`?chapter=${ch.uuid}`}
                  className={`block px-5 py-3 text-sm ${
                    active
                      ? "bg-blue-50 text-blue-700 font-medium"
                      : "hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <span className="block text-xs text-slate-400 mb-1">
                    Chapter {index + 1}
                  </span>
                  {ch.title}
                </Link>
              </li>
            );
          })}
        </ul>
      </aside>

      {/* Overlay */}
      <a
        href="#"
        className="fixed inset-0 bg-black/40 z-40 hidden target:block"
      />
    </div>
  );
}
