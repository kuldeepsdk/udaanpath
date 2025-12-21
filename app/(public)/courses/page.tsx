import { fetchCourseCategories } from "@/app/actions/courses.actions";
import CategoryCard from "@/ui/components/courses/CategoryCard";

export default async function CoursesHomePage() {
  const response = await fetchCourseCategories();
  const categories = response.data || [];

  return (
    <>
      <CoursesHero />
      

      <section id="categories" className="bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 py-16 space-y-8">
            <h2 className="text-3xl font-bold text-slate-900">
            Explore Course Categories
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((cat: any) => (
                <CategoryCard key={cat.id} category={cat} />
            ))}
            </div>
        </div>
        </section>

        <CoursesFeatures />
      <CoursesFAQ />
    </>
  );
}
 function CoursesHero() {
  return (
    <section className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="max-w-3xl space-y-6">

          {/* Badge */}
          <span className="inline-flex items-center rounded-full bg-blue-50 px-4 py-1 text-sm font-medium text-blue-700">
            🎓 Free Learning Platform
          </span>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 leading-tight">
            Learn Skills for <br className="hidden sm:block" />
            Jobs & Competitive Exams
          </h1>

          {/* Subtitle */}
          <p className="text-lg text-slate-600 leading-relaxed">
            Structured courses with chapters, explanations and practice —
            designed specially for Indian students preparing for
            government jobs, exams and career growth.
          </p>

          {/* CTA */}
          <div className="flex flex-wrap gap-4 pt-2">
            <a
              href="#categories"
              className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-6 py-3 text-white font-semibold hover:bg-slate-800 transition"
            >
              Browse Courses
            </a>

            <a
              href="/jobs"
              className="inline-flex items-center justify-center rounded-xl border px-6 py-3 font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              Explore Jobs
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}


function CoursesFeatures() {
  const features = [
    {
      title: "Structured Learning",
      desc: "Courses divided into clear chapters so you never feel lost.",
      icon: "📚",
    },
    {
      title: "Free & Accessible",
      desc: "Most courses are completely free and Hindi-first.",
      icon: "🎓",
    },
    {
      title: "Exam & Job Focused",
      desc: "Designed keeping competitive exams and jobs in mind.",
      icon: "🎯",
    },
    {
      title: "Practice & MCQs",
      desc: "Chapter-wise MCQs and practice (coming soon).",
      icon: "📝",
    },
  ];

  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-4 py-16 space-y-12">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold text-slate-900">
            Why Learn on UdaanPath?
          </h2>
          <p className="mt-2 text-slate-600">
            Everything you need to learn, revise and grow — in one place.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border bg-slate-50 p-6 hover:shadow-md transition"
            >
              <div className="text-3xl">{f.icon}</div>
              <h3 className="mt-4 text-lg font-semibold text-slate-800">
                {f.title}
              </h3>
              <p className="mt-1 text-sm text-slate-600">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
function CoursesFAQ() {
  const faqs = [
    {
      q: "Are these courses really free?",
      a: "Yes. Most courses are completely free and accessible to everyone.",
    },
    {
      q: "Are these courses useful for exams?",
      a: "Yes. Courses are designed keeping government exams and jobs in mind.",
    },
    {
      q: "Is content available in Hindi?",
      a: "Yes. Most courses are Hindi-first, with simple explanations.",
    },
    {
      q: "Will I get certificates?",
      a: "Certificates and assessments are planned for future updates.",
    },
  ];

  return (
    <section className="bg-white">
      <div className="max-w-5xl mx-auto px-4 py-16 space-y-10">
        <h2 className="text-3xl font-bold text-slate-900">
          Frequently Asked Questions
        </h2>

        <div className="space-y-6">
          {faqs.map((f, i) => (
            <div
              key={i}
              className="rounded-xl border bg-slate-50 p-5"
            >
              <h3 className="font-semibold text-slate-800">
                {f.q}
              </h3>
              <p className="mt-1 text-sm text-slate-600">
                {f.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
