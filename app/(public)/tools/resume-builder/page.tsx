import Link from "next/link";
import { RESUME_TEMPLATES } from "@/lib/resume-templates/templates";

export const metadata = {
  title:
    "Free Resume Builder Online – Editable Resume Templates & PDF Download | UdaanPath",
  description:
    "Create a professional resume online for free. Choose editable resume templates, customize directly on screen and download your resume as PDF. No signup required.",
  alternates: {
    canonical: "https://udaanpath.com/tools/resume-builder",
  },
  openGraph: {
    title: "Free Resume Builder Online | UdaanPath",
    description:
      "Build a professional resume online using free editable templates. Edit instantly and download PDF. Mobile friendly & no signup.",
    url: "https://udaanpath.com/tools/resume-builder",
    siteName: "UdaanPath",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Resume Builder Online | UdaanPath",
    description:
      "Choose a resume template, edit online and download PDF. Free resume builder for students & job seekers.",
  },
};

export default function ResumeBuilderPage() {
  /* ================= STRUCTURED DATA ================= */

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "UdaanPath Resume Builder",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description:
      "Free online resume builder with editable templates and PDF download. No signup required.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
    },
  };

  const templatesSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Resume Templates",
    itemListElement: RESUME_TEMPLATES.map((tpl, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: tpl.name,
      url: `https://udaanpath.com/tools/resume-builder/editor/${tpl.id}`,
    })),
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Is UdaanPath Resume Builder free?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Yes. UdaanPath Resume Builder is completely free. You can create, edit and download resumes without any signup.",
        },
      },
      {
        "@type": "Question",
        name: "Can I download my resume as PDF?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Yes. You can download your resume instantly in high-quality PDF format suitable for job applications.",
        },
      },
      {
        "@type": "Question",
        name: "Do I need to create an account?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "No account or signup is required. All resume editing happens directly in your browser.",
        },
      },
      {
        "@type": "Question",
        name: "Is my data safe?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Yes. Your resume data stays in your browser and is never uploaded to any server.",
        },
      },
      {
        "@type": "Question",
        name: "Can I use this resume builder on mobile?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Yes. The resume builder works smoothly on mobile phones, tablets and desktop devices.",
        },
      },
    ],
  };

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      {/* ===== JSON-LD ===== */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(templatesSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* ================== HERO ================== */}
      <h1 className="text-3xl font-bold mb-2">
        Free Online Resume Builder
      </h1>
      <p className="text-gray-700 mb-6 max-w-3xl">
        Create a professional resume online using free editable resume
        templates. Edit directly on screen and download your resume in PDF
        format. No signup required.
      </p>

      {/* ================== STEPS ================== */}
      <div className="grid sm:grid-cols-3 gap-4 mb-10 text-sm">
        <div className="border rounded-xl p-4 bg-white">
          <strong>1️⃣ Choose Resume Template</strong>
          <p className="text-gray-600 mt-1">
            Select a resume template that matches your profile and job role.
          </p>
        </div>
        <div className="border rounded-xl p-4 bg-white">
          <strong>2️⃣ Edit Resume Online</strong>
          <p className="text-gray-600 mt-1">
            Click and edit resume content directly without forms.
          </p>
        </div>
        <div className="border rounded-xl p-4 bg-white">
          <strong>3️⃣ Download Resume PDF</strong>
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
                alt={`${tpl.name} resume template`}
                className="rounded-lg w-full object-cover"
              />
            </div>

            <div className="p-4">
              <h2 className="text-lg font-semibold">{tpl.name}</h2>
              <p className="text-sm text-gray-600 mt-1">
                {tpl.description}
              </p>

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

      {/* ================== FEATURES ================== */}
      <section className="mt-14 max-w-4xl text-sm text-gray-700">
        <h2 className="text-xl font-semibold mb-2">
          Resume Builder Features
        </h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Editable resume templates with live preview</li>
          <li>Download resume in PDF format</li>
          <li>No signup or login required</li>
          <li>Works on mobile, tablet and desktop</li>
          <li>ATS-friendly resume layouts</li>
          <li>Privacy-safe (no data upload)</li>
        </ul>
      </section>

      {/* ================== SEO CONTENT ================== */}
      <section className="mt-10 text-gray-700 text-sm leading-relaxed max-w-4xl">
        <h2 className="text-xl font-semibold mb-2">
          Why use UdaanPath Resume Builder?
        </h2>
        <p>
          UdaanPath Resume Builder helps students, freshers and job seekers
          create professional resumes quickly. Instead of filling long forms,
          you edit the resume directly and see changes instantly.
        </p>

        <p className="mt-3">
          Whether you are applying for internships, private jobs or preparing
          resumes for career growth, this free online resume builder saves
          time and ensures a clean, professional format.
        </p>
      </section>
    </main>
  );
}
