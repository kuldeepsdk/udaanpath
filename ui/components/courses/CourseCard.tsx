import Link from "next/link";

function getImageSrc(base64?: string) {
  if (!base64) return null;
  return base64.startsWith("data:image")
    ? base64
    : `data:image/png;base64,${base64}`;
}

export default function CourseCard({ course }: { course: any }) {
  const imageSrc = getImageSrc(course.thumbnail_base64);

  return (
    <Link
      href={`/courses/${course.slug}`} // ✅ Page 3 will be /courses/[courseSlug]
      className="group rounded-2xl border bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative h-44 overflow-hidden rounded-xl bg-slate-100">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={course.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-400 text-sm">
            No Image
          </div>
        )}
      </div>

      <div className="pt-4 space-y-2">
        <h3 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600">
          {course.title}
        </h3>

        {course.description && (
          <p className="text-sm text-slate-600 line-clamp-2">
            {course.description}
          </p>
        )}

        {/* Meta row (optional) */}
        <div className="pt-2 flex items-center justify-between text-sm">
          <span className="text-slate-500">
            {course.chapter_count ?? 0} Chapters
          </span>
          <span className="font-semibold text-green-600">Free</span>
        </div>
      </div>
    </Link>
  );
}
