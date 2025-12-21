import { fetchAdminJob } from "@/app/actions/admin/jobs.edit.action";
import JobEditTabs from "./tabs";

export default async function EditJobPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // 🔥 IMPORTANT
  const { id } = await params;

  const data = await fetchAdminJob(id);

  if (!data?.success) {
    throw new Error("Failed to load job");
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-slate-800">
        Edit Job
      </h1>

      <JobEditTabs
        jobId={id}
        job={data.job}
        dates={data.dates}
        links={data.links}
        vacancy={data.vacancy}
      />
    </div>
  );
}
