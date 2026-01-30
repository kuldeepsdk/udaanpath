import Link from "next/link";
import { RESUME_TEMPLATES } from "@/lib/resume-templates/templates";

export const metadata = {
  title: "Free Resume Builder Online | Editable Resume Templates – UdaanPath",
  description:
    "Create professional resumes online with UdaanPath Resume Builder. Choose a template, edit directly on screen and download PDF. Free, fast & mobile friendly.",
};

export default function ResumeBuilderPage() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      {/* ================== HERO ================== */}
      <h1 className="text-3xl font-bold mb-2">
        Free Online Resume Builder
      </h1>
      <p className="text-gray-700 mb-6 max-w-3xl">
        Choose a professional resume template, edit it directly on screen and
        download your resume in PDF format. No signup required. Works on mobile.
      </p>

      {/* ================== STEPS ================== */}
      <div className="grid sm:grid-cols-3 gap-4 mb-10 text-sm">
        <div className="border rounded-xl p-4 bg-white">
          <strong>1️⃣ Choose Template</strong>
          <p className="text-gray-600 mt-1">
            Select a resume template that fits your profile.
          </p>
        </div>
        <div className="border rounded-xl p-4 bg-white">
          <strong>2️⃣ Edit Online</strong>
          <p className="text-gray-600 mt-1">
            Click and edit resume content directly on screen.
          </p>
        </div>
        <div className="border rounded-xl p-4 bg-white">
          <strong>3️⃣ Download PDF</strong>
          <p className="text-gray-600 mt-1">
            Download your resume instantly in PDF format.
          </p>
        </div>
      </div>

      {/* ================== TEMPLATE GRID ================== */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {RESUME_TEMPLATES.map((tpl) => (
          <div
            key={tpl.id}
            className="border rounded-2xl overflow-hidden bg-white hover:shadow-lg transition"
          >
            <div className="bg-gray-50 p-3">
              <img
                src={tpl.previewImage}
                alt={tpl.name}
                className="rounded-lg w-full object-cover"
              />
            </div>

            <div className="p-4">
              <h2 className="text-lg font-semibold">{tpl.name}</h2>
              <p className="text-sm text-gray-600 mt-1">
                {tpl.description}
              </p>

              {/* ===== TAGS ===== */}
              {tpl.tags && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {tpl.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <Link
                href={`/tools/resume-builder/editor/${tpl.id}`}
                className="inline-block mt-4 w-full text-center bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
              >
                Use This Template →
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* ================== SEO CONTENT ================== */}
      <section className="mt-12 text-gray-700 text-sm leading-relaxed max-w-4xl">
        <h2 className="text-xl font-semibold mb-2">
          Why use UdaanPath Resume Builder?
        </h2>
        <p>
          Creating a resume should be simple. UdaanPath Resume Builder lets you
          choose from professionally designed templates, edit content directly
          on the resume and download it instantly. No complex forms and no
          unnecessary steps.
        </p>

        <p className="mt-3">
          This tool is ideal for students, freshers and job seekers preparing
          resumes for government or private jobs. All editing happens in your
          browser and your data remains private.
        </p>
      </section>
    </main>
  );
}
