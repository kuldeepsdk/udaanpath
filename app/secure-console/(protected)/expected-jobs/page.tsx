import {
  fetchExpectedJobs,
  updateExpectedJobStatus,
} from "@/app/actions/admin/jobmonitor.action";

type SearchParams = Record<string, string | string[] | undefined>;

export default async function AdminExpectedJobsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  // ✅ Next.js 16: searchParams is async
  const resolvedSearchParams = await searchParams;

  const rawStatus = Array.isArray(resolvedSearchParams.status)
    ? resolvedSearchParams.status[0]
    : resolvedSearchParams.status;

  const status =
    rawStatus === "released" || rawStatus === "delayed"
      ? rawStatus
      : "waiting";

  // 🔹 Fetch jobs
  const response = await fetchExpectedJobs({
    status,
    limit: 50,
  });

  const jobs = response?.data ?? [];

  return (
    <div className="space-y-6">
      {/* ================= Header ================= */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">
            Expected Jobs
          </h1>
          <p className="text-sm text-slate-500">
            Monitor and control upcoming job notifications
          </p>
        </div>
      </div>

      {/* ================= Status Tabs ================= */}
      <div className="flex gap-2">
        {["waiting", "released", "delayed"].map((s) => (
          <a
            key={s}
            href={`?status=${s}`}
            className={`px-4 py-2 rounded-lg text-sm border
              ${
                status === s
                  ? "bg-slate-900 text-white"
                  : "bg-white text-slate-700 hover:bg-slate-100"
              }`}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </a>
        ))}
      </div>

      {/* ================= Table ================= */}
      <div className="bg-white border rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b">
            <tr className="text-left">
              <th className="px-4 py-3">Job</th>
              <th className="px-4 py-3">Source</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Expected</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {jobs.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-6 text-center text-slate-500"
                >
                  No expected jobs found
                </td>
              </tr>
            )}

            {jobs.map((job: any) => (
              <tr key={job.id} className="border-b last:border-0">
                {/* Job */}
                <td className="px-4 py-3">
                  <div className="font-medium text-slate-800">
                    {job.title}
                  </div>
                  <div className="text-xs text-slate-500">
                    {job.job_key}
                  </div>
                </td>

                {/* Source */}
                <td className="px-4 py-3">
                  {job.source_name}
                </td>

                {/* Category */}
                <td className="px-4 py-3 capitalize">
                  {job.category}
                </td>

                {/* Expected */}
                <td className="px-4 py-3">
                  {job.expected_month} {job.expected_year}
                </td>

                {/* Status */}
                <td className="px-4 py-3 capitalize">
                  {job.status}
                </td>

                {/* Actions */}
                <td className="px-4 py-3 text-right space-x-2">
                  {/* ===== RELEASE ===== */}
                  {job.status !== "released" && (
                    <form
                      className="inline"
                      action={async () => {
                        "use server";
                        await updateExpectedJobStatus({
                          id: job.id,
                          action: "release",
                          // 🔴 For now static URL (next step: modal input)
                          notification_url: "https://example.com/notification.pdf",
                        });
                      }}
                    >
                      <button className="px-3 py-1 rounded bg-emerald-600 text-white text-xs hover:bg-emerald-700">
                        Release
                      </button>
                    </form>
                  )}

                  {/* ===== DELAY ===== */}
                  {job.status !== "delayed" && (
                    <form
                      className="inline"
                      action={async () => {
                        "use server";
                        await updateExpectedJobStatus({
                          id: job.id,
                          action: "delay",
                        });
                      }}
                    >
                      <button className="px-3 py-1 rounded bg-amber-500 text-white text-xs hover:bg-amber-600">
                        Delay
                      </button>
                    </form>
                  )}

                  {/* ===== RESET ===== */}
                  {job.status !== "waiting" && (
                    <form
                      className="inline"
                      action={async () => {
                        "use server";
                        await updateExpectedJobStatus({
                          id: job.id,
                          action: "reset",
                        });
                      }}
                    >
                      <button className="px-3 py-1 rounded border text-xs hover:bg-slate-100">
                        Reset
                      </button>
                    </form>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
