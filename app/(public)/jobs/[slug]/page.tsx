import Link from "next/link";
import { Metadata } from "next";
import { fetchJobDetail } from "@/app/actions/jobs.detail.action";
import { SITE_CONFIG } from "@/config/site";
import JobPosterClient from "@/ui/components/job/JobPosterClient";



/* ================================
   PAGE
================================ */
export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { job, dates, links, vacancy } = await fetchJobDetail(slug);

  /* ================================
     Schema.org – JobPosting
  ================================ */
  const jobPostingSchema = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.summary || job.full_description,
    datePosted: job.created_at,
    hiringOrganization: {
      "@type": "Organization",
      name: job.organization || "Government Organization",
      sameAs: job.official_website || undefined,
    },
    employmentType: "FULL_TIME",
    industry: "Government",
    jobLocationType: "INDIA",
    applicantLocationRequirements: {
      "@type": "Country",
      name: "India",
    },
    validThrough:
      dates?.find((d: any) => d.event_key === "apply_end")?.event_date ||
      undefined,
  };

  /* ================================
     Breadcrumb Schema
  ================================ */
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Jobs",
        item: "https://udaanpath.com/jobs",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: job.title,
        item: `https://udaanpath.com/jobs/${job.slug}`,
      },
    ],
  };

  return (
  <>
    {/* ================= SCHEMA ================= */}
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingSchema) }}
    />
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
    />

    {/* ================= PAGE ================= */}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-12">

      {/* ---------- Breadcrumb ---------- */}
      <nav className="text-sm text-slate-500">
        <Link href="/jobs" className="hover:underline">Jobs</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-700">{job.title}</span>
      </nav>

      {/* ================= HERO ================= */}
      <section className="relative bg-white border rounded-3xl p-6 sm:p-10 shadow-lg space-y-6">

        {/* Badge */}
        <span className={`inline-block text-xs px-3 py-1 rounded-full ${badgeClass(job.category)}`}>
          {labelForCategory(job.category)}
        </span>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
          {job.title}
        </h1>

        {/* Org */}
        {job.organization && (
          <p className="text-slate-600 text-sm">
            Conducted by <span className="font-medium">{job.organization}</span>
          </p>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
          <Stat label="Vacancies" value={job.total_posts?.toLocaleString() || "—"} />
          <Stat label="Qualification" value={job.qualification || "—"} />
          <Stat label="Salary" value={job.salary || "—"} />
          <Stat label="Age Limit" value={job.age_limit || "—"} />
        </div>

        {/* CTA */}
        <div className="flex flex-wrap gap-3 pt-4">
          {job.apply_link && (
            <a
              href={job.apply_link}
              target="_blank"
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700"
            >
              🚀 Apply Online
            </a>
          )}

          <a
            href={`https://api.whatsapp.com/send/?text=${buildWhatsappMessage(job)}`}
            target="_blank"
            className="px-6 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700"
          >
            📲 Share on WhatsApp
          </a>

          <JobPosterClient job={job} />
        </div>
      </section>

      {/* ================= IMAGE ================= */}
      {job.notification_image_base64 && (
        <img
          src={job.notification_image_base64}
          alt={job.title}
          className="w-full rounded-3xl border shadow"
        />
      )}

      {/* ================= SUMMARY ================= */}
      {job.summary && (
        <section className="bg-gradient-to-r from-blue-50 to-indigo-50 border rounded-2xl p-6 text-slate-700 text-sm leading-relaxed">
          {job.summary}
        </section>
      )}

      {/* ================= GRID ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Important Dates */}
        {dates?.length > 0 && (
        <Section title="📅 Important Dates">
          <ul className="space-y-3">
            {dates.map((d:any) => (
              <li
                key={d.id}
                className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3"
              >
                <span className="font-medium">{d.event_label}</span>
                <span className="text-sm font-semibold text-slate-800">
                  {new Date(d.event_date).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        </Section>
      )}


        {/* Vacancy */}
        {vacancy?.length > 0 && (
          <Section title="🧾 Vacancy Breakdown">

            {/* Summary */}
            <div className="mb-4 text-sm text-slate-600">
              Total Vacancies:{" "}
              <span className="font-semibold text-slate-900">
                {vacancy.reduce((s:any, v:any) => s + v.total_posts, 0).toLocaleString()}
              </span>
            </div>

            {/* Mobile cards */}
            <div className="space-y-3 sm:hidden">
              {vacancy.map((v:any) => (
                <div
                  key={v.id}
                  className="flex justify-between items-center bg-slate-50 rounded-xl px-4 py-3"
                >
                  <span className="font-medium">{v.post_name}</span>
                  <span className="font-bold text-blue-600">
                    {v.total_posts.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Desktop table */}
            <div className="hidden sm:block overflow-hidden rounded-xl border">
              <table className="w-full text-sm">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="px-4 py-3 text-left">Post</th>
                    <th className="px-4 py-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {vacancy.map((v:any) => (
                    <tr key={v.id} className="border-t">
                      <td className="px-4 py-3">{v.post_name}</td>
                      <td className="px-4 py-3 text-right font-semibold">
                        {v.total_posts.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </Section>
        )}

      </div>

      {/* ================= Selection Process ================= */}
      {job.selection_process && (
        <Section title="🧩 Selection Process">

          {/<[a-z][\s\S]*>/i.test(job.selection_process) ? (
            // HTML content
            <div
              className="prose prose-slate max-w-none"
              dangerouslySetInnerHTML={{
                __html: job.selection_process,
              }}
            />
          ) : (
            // Plain text (arrow / > / comma based)
            <ul className="space-y-3">
              {job.selection_process
                .split(/>|,|→/g)
                .map((step: string, idx: number) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 bg-slate-50 rounded-xl px-4 py-3"
                  >
                    <span className="text-blue-600 font-bold">
                      {idx + 1}.
                    </span>
                    <span className="font-medium text-slate-800">
                      {step.trim()}
                    </span>
                  </li>
                ))}
            </ul>
          )}

        </Section>
      )}

      {/* ================= DESCRIPTION ================= */}
      {job.full_description && (
        <Section title="📘 Detailed Information">
          <div
            className="prose prose-slate max-w-none"
            dangerouslySetInnerHTML={{ __html: job.full_description }}
          />
        </Section>
      )}

      {/* ================= LINKS ================= */}
      {links?.length > 0 && (
        <Section title="🔗 Important Links">
          <ul className="space-y-3">
            {links.map((l: any) => (
              <li key={l.id}>
                <a
                  href={l.url}
                  target="_blank"
                  className="block px-4 py-3 bg-slate-50 rounded-lg hover:bg-slate-100 text-blue-600 font-medium"
                >
                  {l.label || labelForLink(l.link_type)}
                </a>
              </li>
            ))}
          </ul>
        </Section>
      )}
    </div>

    {/* ================= MOBILE STICKY CTA ================= */}
    <div className="fixed bottom-4 left-0 right-0 px-4 sm:hidden z-50">
      <a
        href={`https://api.whatsapp.com/send/?text=${buildWhatsappMessage(job)}`}
        target="_blank"
        className="flex items-center justify-center gap-2 bg-green-600 text-white py-4 rounded-2xl shadow-xl font-semibold"
      >
        📲 Share Job on WhatsApp
      </a>
    </div>
  </>
);

}

/* ================================
   HELPERS
================================ */
function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white border rounded-3xl p-6 space-y-4 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">
        {title}
      </h2>
      {children}
    </div>
  );
}

function labelForCategory(cat: string) {
  switch (cat) {
    case "job":
      return "Job";
    case "admit_card":
      return "Admit Card";
    case "result":
      return "Result";
    case "admission":
      return "Admission";
    default:
      return "Update";
  }
}

function badgeClass(cat: string) {
  switch (cat) {
    case "job":
      return "bg-blue-100 text-blue-700";
    case "admit_card":
      return "bg-purple-100 text-purple-700";
    case "result":
      return "bg-green-100 text-green-700";
    case "admission":
      return "bg-orange-100 text-orange-700";
    default:
      return "bg-slate-100 text-slate-600";
  }
}

function labelForLink(type: string) {
  switch (type) {
    case "apply":
      return "Apply Online";
    case "notification":
      return "Official Notification";
    case "admit_card":
      return "Download Admit Card";
    case "result":
      return "View Result";
    case "answer_key":
      return "Answer Key";
    default:
      return "Open Link";
  }
}

/* ================================
   WhatsApp Message Builder
================================ */
export function buildWhatsappMessage(job: any) {
  const pageUrl = job.slug
    ? `https://udaanpath.com/jobs/${job.slug}`
    : "https://udaanpath.com/jobs";

  const lines: string[] = [];

  lines.push(`📢 ${job.title}`);

  if (job.total_posts) {
    lines.push(`📌 Vacancies: ${job.total_posts}`);
  }

  if (job.qualification) {
    lines.push(`🎓 Qualification: ${job.qualification}`);
  }

  lines.push("");
  lines.push(`👉 View full details & apply:`);
  lines.push(pageUrl);
  lines.push("");
  lines.push(
    "📲 Daily Sarkari Job, Admit Card & Result Updates\nJoin UdaanPath WhatsApp Channel 👇"
  );
  lines.push(
    "https://whatsapp.com/channel/0029VbBG8135PO0sX5HVPZ1p"
  );

  return encodeURIComponent(lines.join("\n"));
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-slate-50 rounded-xl p-4 text-center">
      <div className="text-sm text-slate-500">{label}</div>
      <div className="font-bold text-slate-900 text-lg">{value}</div>
    </div>
  );
}
