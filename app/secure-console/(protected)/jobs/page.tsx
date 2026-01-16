/* =====================================================
   Force dynamic rendering (important for admin pages)
===================================================== */
export const dynamic = "force-dynamic";

import { fetchAdminJobs } from "@/app/actions/admin/jobs.list.action";
import JobStatusToggle from "./JobStatusToggle";
import DeleteJobButton from "./DeleteJobButton";

type SearchParams = Promise<{
  [key: string]: string | string[] | undefined;
}>;

export default async function AdminJobsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  /* ===============================
     1️⃣ Await searchParams (KEY FIX)
  =============================== */
  const params = await searchParams;

  const rawPage = params?.page;

  const page =
    typeof rawPage === "string" && !isNaN(Number(rawPage))
      ? Math.max(Number(rawPage), 1)
      : 1;

  const limit = 10;

  console.log("AdminJobsPage - page:", page);

  /* ===============================
     2️⃣ Fetch jobs
  =============================== */
  const response = await fetchAdminJobs({ page, limit });
  const jobs = response?.data || [];
  const meta = response?.meta;

  const totalPages = meta?.totalPages || 1;
  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  /* ===============================
     3️⃣ Pagination numbers (max 5)
  =============================== */
  const startPage = Math.max(1, page - 2);
  const visiblePages = Array.from({ length: 5 }, (_, i) => startPage + i).filter(
    (p) => p <= totalPages
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">
            Vacancies / Jobs
          </h1>
          <p className="text-sm text-slate-500">
            Manage job notifications
          </p>
        </div>

        <a
          href="/secure-console/jobs/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
        >
          + New Vacancy
        </a>
      </div>

      {/* Table */}
      <div className="bg-white border rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b">
            <tr className="text-left">
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Organization</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Created</th>
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
                  No vacancies found
                </td>
              </tr>
            )}

            {jobs.map((job: any) => (
              <tr key={job.id} className="border-b last:border-0">
                <td className="px-4 py-3 font-medium text-slate-800">
                  {job.title}
                </td>

                <td className="px-4 py-3 text-slate-600">
                  {job.category}
                </td>

                <td className="px-4 py-3 text-slate-600">
                  {job.organization || "-"}
                </td>

                <td className="px-4 py-3">
                  <JobStatusToggle
                    jobId={job.id}
                    published={job.published}
                  />
                </td>

                <td className="px-4 py-3 text-slate-500">
                  {job.created_at
                    ? new Date(job.created_at).toLocaleDateString()
                    : "-"}
                </td>

                <td className="px-4 py-3 text-right space-x-3">
                  <a
                    href={`/secure-console/jobs/${job.id}/edit`}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </a>

                  <DeleteJobButton jobId={job.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">
            Page {page} of {totalPages}
          </span>

          <div className="flex items-center space-x-1">
            {hasPrev && (
              <a
                href={`/secure-console/jobs?page=${page - 1}`}
                className="px-3 py-1 border rounded hover:bg-slate-100"
              >
                Prev
              </a>
            )}

            {visiblePages.map((p) => (
              <a
                key={p}
                href={`/secure-console/jobs?page=${p}`}
                className={`px-3 py-1 border rounded ${
                  p === page
                    ? "bg-blue-600 text-white border-blue-600"
                    : "hover:bg-slate-100"
                }`}
              >
                {p}
              </a>
            ))}

            {hasNext && (
              <a
                href={`/secure-console/jobs?page=${page + 1}`}
                className="px-3 py-1 border rounded hover:bg-slate-100"
              >
                Next
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
