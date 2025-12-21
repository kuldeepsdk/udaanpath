import Link from "next/link";
import { fetchPublicJobs } from "@/app/actions/jobs.list.action";

const CATEGORY_META: Record<
  string,
  { label: string; description: string }
> = {
  job: {
    label: "Government Jobs / Vacancy",
    description: "Latest government job vacancies across India",
  },
  admit_card: {
    label: "Admit Cards",
    description: "Latest admit cards for government exams",
  },
  result: {
    label: "Results",
    description: "Latest government exam results",
  },
  admission: {
    label: "Admissions",
    description: "Latest admissions & counselling updates",
  },
};

export default async function JobCategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ page?: string; q?: string }>;
}) {
  const { category } = await params;
  const sp = await searchParams;

  if (!CATEGORY_META[category]) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center text-slate-600">
        Invalid category
      </div>
    );
  }

  const page = Math.max(Number(sp.page || 1), 1);
  const q = (sp.q || "").trim();

  const resp = await fetchPublicJobs({
    page,
    limit: 12,
    q,
    category,
  });

  const jobs = resp?.data ?? [];
  const meta = resp?.meta;
  const catMeta = CATEGORY_META[category];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">

      {/* ================= HEADER ================= */}
      <div className="space-y-2">
        <Link
          href="/jobs"
          className="inline-flex items-center text-sm text-blue-600 hover:underline"
        >
          ← Back to all updates
        </Link>

        <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900">
          {catMeta.label}
        </h1>
        <p className="text-sm text-slate-500">
          {catMeta.description}
        </p>
      </div>

      {/* ================= SEARCH ================= */}
      <form
        method="get"
        className="bg-white border rounded-2xl p-4 flex flex-col sm:flex-row gap-3"
      >
        <input
          name="q"
          defaultValue={q}
          placeholder={`Search in ${catMeta.label.toLowerCase()}...`}
          className="flex-1 border rounded-lg px-3 py-2 text-sm"
        />

        <button className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm hover:bg-blue-700">
          Search
        </button>

        {q && (
          <Link
            href={`/jobs/category/${category}`}
            className="text-sm text-slate-600 hover:underline self-center"
          >
            Clear
          </Link>
        )}
      </form>

      {/* ================= LISTING ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {jobs.length === 0 ? (
          <div className="text-slate-500 text-sm">
            No updates found.
          </div>
        ) : (
          jobs.map((j: any) => (
            <Link
              key={j.id}
              href={`/jobs/${j.slug}`}
              className="group bg-white border rounded-2xl p-5 hover:shadow-lg transition"
            >
              {/* Badge */}
              <span className={`inline-block mb-2 px-2 py-0.5 text-xs rounded-full ${badgeClass(j.category)}`}>
                {catMeta.label.split(" ")[0]}
              </span>

              {/* Image */}
              {j.image_base64 && (
                <img
                  src={j.image_base64}
                  alt={j.title}
                  className="w-full h-40 object-cover rounded-lg mb-3"
                />
              )}

              <h3 className="text-base font-semibold text-slate-900 group-hover:text-blue-600 leading-snug">
                {j.title}
              </h3>

              {j.organization && (
                <p className="mt-1 text-xs text-slate-500">
                  {j.organization}
                </p>
              )}

              {j.summary && (
                <p className="mt-2 text-sm text-slate-600 line-clamp-2">
                  {j.summary}
                </p>
              )}

              <div className="mt-3 flex justify-between text-xs text-slate-500">
                <span>
                  {new Date(j.created_at).toLocaleDateString()}
                </span>
                {j.total_posts && (
                  <span>Posts: {j.total_posts}</span>
                )}
              </div>
            </Link>
          ))
        )}
      </div>

      {/* ================= PAGINATION ================= */}
      {meta?.totalPages > 1 && (
        <div className="flex items-center justify-between pt-4">
          <Link
            href={buildPageHref(page - 1, q, category)}
            className={`px-3 py-2 rounded-lg text-sm border ${
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
            className={`px-3 py-2 rounded-lg text-sm border ${
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

function buildPageHref(
  page: number,
  q: string,
  category: string
) {
  const sp = new URLSearchParams();
  sp.set("page", String(page));
  if (q) sp.set("q", q);
  return `/jobs/category/${category}?${sp.toString()}`;
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
