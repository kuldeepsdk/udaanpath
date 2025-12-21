import Link from "next/link";
import { fetchCategoryCourses } from "@/app/actions/courses.actions";

function getImageSrc(base64?: string) {
  if (!base64) return null;
  if (base64.startsWith("data:image")) return base64;
  return `data:image/png;base64,${base64}`;
}

export default async function CategoryCoursesPage({
  params,
}: {
  params: Promise<{ categorySlug: string }>;
}) {
  const { categorySlug } = await params;

  const response = await fetchCategoryCourses(categorySlug);

  const category = response.category;
  const courses = response.courses || [];

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* =====================
         HERO / HEADER
      ====================== */}
      <section className="relative bg-white border-b overflow-hidden">
        {/* soft background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/60 via-white to-indigo-50/40" />

        <div className="relative max-w-7xl mx-auto px-4 py-16">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900">
            {category.name}
          </h1>

          <p className="mt-3 text-lg text-slate-600 max-w-3xl">
            Structured learning paths designed for Indian students.
            Learn step-by-step with chapters, notes & practice questions.
          </p>

          <div className="mt-6 flex items-center gap-6 text-sm text-slate-600">
            <span className="font-medium">
              📘 {courses.length} Courses
            </span>
            <span>🆓 Free Learning</span>
            <span>🇮🇳 Hindi & English</span>
          </div>
        </div>
      </section>


      {/* =====================
         COURSES LIST
      ====================== */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        {courses.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            No courses available in this category yet.
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course: any) => {
              const imageSrc = getImageSrc(course.thumbnail_base64);

              return (
                <Link
                  key={course.id}
                  href={`/courses/${course.slug}`}
                  className="group bg-white rounded-2xl border shadow-sm hover:shadow-lg transition overflow-hidden"
                >
                  {/* Thumbnail */}
                  {imageSrc ? (
                    <img
                      src={imageSrc}
                      alt={course.title}
                      className="h-44 w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="h-44 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center text-slate-400 text-sm">
                      No Image
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-5 space-y-3">
                    <h3 className="text-lg font-semibold text-slate-800 group-hover:text-blue-600 line-clamp-2">
                      {course.title}
                    </h3>

                    {course.description && (
                      <p className="text-sm text-slate-600 line-clamp-3">
                        {course.description}
                      </p>
                    )}

                    <div className="pt-2">
                      <span className="inline-flex items-center text-sm font-medium text-blue-600">
                        View Course →
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-slate-900 mb-8">
          Why Learn on UdaanPath?
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "Free Courses", desc: "No payment, no hidden charges." },
            { title: "Structured Chapters", desc: "Learn step by step." },
            { title: "Indian Context", desc: "Made for Indian exams & students." },
            { title: "Practice Ready", desc: "MCQs & notes included." },
          ].map((f, i) => (
            <div
              key={i}
              className="bg-white border rounded-xl p-5 shadow-sm"
            >
              <h3 className="font-semibold text-slate-800">
                {f.title}
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
