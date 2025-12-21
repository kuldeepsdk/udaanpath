import Link from "next/link";
import { Metadata } from "next";
import { fetchJobDetail } from "@/app/actions/jobs.detail.action";
import { SITE_CONFIG } from "@/config/site";



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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-10">

        {/* ---------- Breadcrumb ---------- */}
        <nav className="text-sm text-slate-500">
          <Link href="/jobs" className="hover:underline">
            Jobs
          </Link>{" "}
          / {job.title}
        </nav>

        {/* ---------- Header ---------- */}
        <div className="bg-white border rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
          <span
            className={`inline-block text-xs px-3 py-1 rounded-full ${badgeClass(
              job.category
            )}`}
          >
            {labelForCategory(job.category)}
          </span>

          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-snug">
            {job.title}
          </h1>

          {job.organization && (
            <p className="text-sm text-slate-600">{job.organization}</p>
          )}

          {/* WhatsApp Share (Top CTA) */}
          <a
            href={`https://api.whatsapp.com/send/?text=${buildWhatsappMessage(
              job
            )}`}
            target="_blank"
            className="inline-flex items-center gap-2 text-green-700 text-sm font-medium hover:underline"
          >
            📲 Share on WhatsApp
          </a>
        </div>

        {/* ---------- Notification Image ---------- */}
        {job.notification_image_base64 && (
          <img
            src={job.notification_image_base64}
            alt={job.title}
            className="w-full rounded-3xl border"
          />
        )}

        {/* ---------- Summary ---------- */}
        {job.summary && (
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-sm text-slate-700">
            {job.summary}
          </div>
        )}

        {/* ---------- Important Dates ---------- */}
        {dates?.length > 0 && (
          <Section title="Important Dates">
            <ul className="divide-y">
              {dates.map((d: any) => (
                <li
                  key={d.id}
                  className="py-3 flex justify-between text-sm"
                >
                  <span>{d.event_label}</span>
                  <span className="font-medium">
                    {d.event_date
                      ? new Date(d.event_date).toLocaleDateString()
                      : "-"}
                  </span>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* ---------- Vacancy Breakup ---------- */}
        {vacancy?.length > 0 && (
          <Section title="Vacancy Details">
            <table className="w-full text-sm border rounded-xl overflow-hidden">
              <thead className="bg-slate-50">
                <tr>
                  <th className="border px-3 py-2 text-left">Post</th>
                  <th className="border px-3 py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {vacancy.map((v: any) => (
                  <tr key={v.id}>
                    <td className="border px-3 py-2">{v.post_name}</td>
                    <td className="border px-3 py-2 text-right">
                      {v.total_posts}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Section>
        )}

        {/* ---------- Full Description ---------- */}
        {job.full_description && (
          <Section title="Detailed Information">
            <div
              className="prose prose-slate max-w-none"
              dangerouslySetInnerHTML={{
                __html: job.full_description,
              }}
            />
          </Section>
        )}

        {/* ---------- Important Links ---------- */}
        {links?.length > 0 && (
          <Section title="Important Links">
            <ul className="space-y-2">
              {links.map((l: any) => (
                <li key={l.id}>
                  <a
                    href={l.url}
                    target="_blank"
                    className="text-blue-600 hover:underline text-sm"
                  >
                    {l.label || labelForLink(l.link_type)}
                  </a>
                </li>
              ))}
            </ul>
          </Section>
        )}
      </div>

      {/* ---------- Sticky WhatsApp CTA (Mobile) ---------- */}
      <div className="fixed bottom-4 left-0 right-0 px-4 sm:hidden z-50">
        <a
          href={`https://api.whatsapp.com/send/?text=${buildWhatsappMessage(
            job
          )}`}
          target="_blank"
          className="flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-2xl shadow-lg text-sm font-medium"
        >
          📲 Share on WhatsApp
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
