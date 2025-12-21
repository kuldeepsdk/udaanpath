import Link from "next/link";
import { fetchPublicJobs } from "@/app/actions/jobs.list.action";

/* ===============================
   FILTER DROPDOWN CATEGORIES
================================ */
const JOB_CATEGORIES = [
  { value: "", label: "All Updates" },
  { value: "job", label: "Jobs / Vacancy" },
  { value: "admit_card", label: "Admit Card" },
  { value: "result", label: "Result" },
  { value: "admission", label: "Admission" },
];

/* ===============================
   CATEGORY QUICK LINKS
================================ */
const CATEGORY_CARDS = [
  {
    key: "job",
    label: "Jobs / Vacancy",
    desc: "Latest government job openings",
    color: "blue",
  },
  {
    key: "admit_card",
    label: "Admit Card",
    desc: "Download exam admit cards",
    color: "purple",
  },
  {
    key: "result",
    label: "Result",
    desc: "Check latest exam results",
    color: "green",
  },
  {
    key: "admission",
    label: "Admission",
    desc: "Admissions & counselling updates",
    color: "orange",
  },
];


export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    q?: string;
    category?: string;
  }>;
}) {
  const sp = await searchParams;

  const page = Math.max(Number(sp.page || 1), 1);
  const q = (sp.q || "").trim();
  const category = (sp.category || "").trim();

  const resp = await fetchPublicJobs({
    page,
    limit: 12,
    q,
    category,
  });

  const jobs = resp?.data ?? [];
  const meta = resp?.meta;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">

      {/* ================= HEADER ================= */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-slate-900">
          Government Job Updates
        </h1>
        <p className="text-sm text-slate-500">
          Jobs, Admit Cards, Results & Admissions
        </p>
      </div>

      {/* ================= CATEGORY QUICK LINKS ================= */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {CATEGORY_CARDS.map((cat) => (
          <Link
            key={cat.key}
            href={`/jobs/category/${cat.key}`}
            className={`group rounded-2xl border bg-white p-4 hover:shadow-md transition`}
          >
            <div
              className={`inline-flex items-center justify-center w-9 h-9 rounded-xl mb-3 ${badgeBg(cat.color)}`}
            >
              <span className={`text-sm font-bold ${badgeText(cat.color)}`}>
                {cat.label.charAt(0)}
              </span>
            </div>

            <h3 className="text-sm font-semibold text-slate-900 group-hover:text-blue-600">
              {cat.label}
            </h3>

            <p className="mt-1 text-xs text-slate-500 line-clamp-2">
              {cat.desc}
            </p>

            <div className="mt-3 text-xs text-blue-600 font-medium">
              View →
            </div>
          </Link>
        ))}
      </div>


      {/* ================= FILTER BAR ================= */}
      <div className="bg-white/90 backdrop-blur border rounded-2xl p-4 shadow-sm">
        <form
          action="/jobs"
          method="get"
          className="flex flex-col lg:flex-row gap-3"
        >
          <input
            name="q"
            defaultValue={q}
            placeholder="Search job title, exam, organization..."
            className="flex-1 border rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500"
          />

          <select
            name="category"
            defaultValue={category}
            className="w-full lg:w-56 border rounded-xl px-3 py-2.5 text-sm bg-white"
          >
            {JOB_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition"
          >
            Search
          </button>

          {(q || category) && (
            <Link
              href="/jobs"
              className="text-sm text-slate-500 hover:text-slate-800 self-center"
            >
              Clear
            </Link>
          )}
        </form>

        {(q || category) && (
          <div className="mt-3 text-xs text-slate-500">
            Showing results
            {q && <> for <b className="text-slate-700">"{q}"</b></>}
            {category && <> in <b>{labelForCategory(category)}</b></>}
          </div>
        )}
      </div>

      {/* ================= JOB LISTING ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.length === 0 ? (
          <div className="text-slate-500 text-sm">
            No updates found.
          </div>
        ) : (
          jobs.map((j: any) => (
            <Link
              key={j.id}
              href={`/jobs/${j.slug}`}
              className="group bg-white border rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* IMAGE / HEADER */}
              <div className="relative h-40 w-full overflow-hidden">
                {j.image_base64 ? (
                  <img
                    src={j.image_base64}
                    alt={j.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className={`h-full w-full flex items-center justify-center ${gradientForCategory(j.category)}`}>
                    <span className="text-white text-3xl">
                      {iconForCategory(j.category)}
                    </span>
                  </div>
                )}

                {/* Badge */}
                <span
                  className={`absolute top-3 left-3 text-xs font-medium px-2 py-1 rounded-full ${badgeClass(j.category)}`}
                >
                  {labelForCategory(j.category)}
                </span>
              </div>

              {/* CONTENT */}
              <div className="p-5 space-y-2">
                <h3 className="font-semibold text-slate-900 leading-snug line-clamp-2 group-hover:text-blue-600">
                  {j.title}
                </h3>

                {j.organization && (
                  <p className="text-xs text-slate-500">
                    {j.organization}
                  </p>
                )}

                {j.summary && (
                  <p className="text-sm text-slate-600 line-clamp-2">
                    {j.summary}
                  </p>
                )}

                <div className="pt-3 flex items-center justify-between text-xs text-slate-500">
                  <span>
                    {j.created_at
                      ? new Date(j.created_at).toLocaleDateString()
                      : ""}
                  </span>
                  {j.total_posts && (
                    <span className="font-medium">
                      Posts: {j.total_posts}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

      {/* ================= PAGINATION ================= */}
      {meta?.totalPages > 1 && (
        <div className="flex items-center justify-between pt-6">
          <Link
            href={buildPageHref(page - 1, q, category)}
            className={`px-4 py-2 rounded-xl border text-sm ${
              meta.hasPrev
                ? "hover:bg-slate-50"
                : "opacity-40 pointer-events-none"
            }`}
          >
            ← Prev
          </Link>

          <div className="text-sm text-slate-600">
            Page <b>{meta.page}</b> of <b>{meta.totalPages}</b>
          </div>

          <Link
            href={buildPageHref(page + 1, q, category)}
            className={`px-4 py-2 rounded-xl border text-sm ${
              meta.hasNext
                ? "hover:bg-slate-50"
                : "opacity-40 pointer-events-none"
            }`}
          >
            Next →
          </Link>
        </div>
      )}
    </div>
  );
}

/* ================= HELPERS ================= */


/* ================= HELPERS ================= */

function buildPageHref(page: number, q: string, category: string) {
  const sp = new URLSearchParams();
  sp.set("page", String(page));
  if (q) sp.set("q", q);
  if (category) sp.set("category", category);
  return `/jobs?${sp.toString()}`;
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

function gradientForCategory(cat: string) {
  switch (cat) {
    case "job":
      return "bg-gradient-to-br from-blue-500 to-indigo-600";
    case "admit_card":
      return "bg-gradient-to-br from-purple-500 to-pink-600";
    case "result":
      return "bg-gradient-to-br from-green-500 to-emerald-600";
    case "admission":
      return "bg-gradient-to-br from-orange-500 to-red-500";
    default:
      return "bg-gradient-to-br from-slate-400 to-slate-600";
  }
}

function iconForCategory(cat: string) {
  switch (cat) {
    case "job":
      return "💼";
    case "admit_card":
      return "🪪";
    case "result":
      return "📊";
    case "admission":
      return "🎓";
    default:
      return "📢";
  }
}


function badgeBg(color: string) {
  switch (color) {
    case "blue":
      return "bg-blue-100";
    case "purple":
      return "bg-purple-100";
    case "green":
      return "bg-green-100";
    case "orange":
      return "bg-orange-100";
    default:
      return "bg-slate-100";
  }
}

function badgeText(color: string) {
  switch (color) {
    case "blue":
      return "text-blue-700";
    case "purple":
      return "text-purple-700";
    case "green":
      return "text-green-700";
    case "orange":
      return "text-orange-700";
    default:
      return "text-slate-700";
  }
}