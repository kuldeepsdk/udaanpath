import {
  fetchExpectedJobsForAlert,
  mapAlertToExpectedJob,
} from "@/app/actions/admin/sourceAlertMapping.action";

export default async function AlertMappingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // ✅ FIX: unwrap params
  const resolvedParams = await params;
  const alertId = Number(resolvedParams.id);

  if (!alertId) {
    throw new Error("Invalid alert id");
  }

  const resp = await fetchExpectedJobsForAlert(alertId);
  const jobs = resp?.jobs ?? [];
  const alert = resp?.alert;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">
          Map Alert → Expected Job
        </h1>
        <p className="text-sm text-slate-500">
          {alert.source_name}
        </p>
      </div>

      <div className="bg-white border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="p-3 text-left">Job</th>
              <th className="p-3 text-left">Expected</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {jobs.length === 0 && (
              <tr>
                <td colSpan={3} className="p-6 text-center">
                  No matching expected jobs
                </td>
              </tr>
            )}

            {jobs.map((job: any) => (
              <tr key={job.id} className="border-t">
                <td className="p-3">
                  <div className="font-medium">{job.title}</div>
                  <div className="text-xs text-slate-500">
                    {job.job_key}
                  </div>
                </td>

                <td className="p-3">
                  {job.expected_month} {job.expected_year}
                </td>

                <td className="p-3">
                  <form
                    action={async () => {
                      "use server";
                      await mapAlertToExpectedJob(alertId, job.id);
                    }}
                  >
                    <button className="px-3 py-1 rounded bg-emerald-600 text-white">
                      Release Job
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
