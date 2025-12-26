import StatCard from "@/app/ueas/org/dashboard/components/StatCard";

export default function OrgDashboardPage() {
  return (
    <>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">
        Dashboard
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        <StatCard
          title="Total Students"
          value="1,240"
          subtitle="Across all batches"
        />

        <StatCard
          title="Total Exams"
          value="18"
          subtitle="Created so far"
        />

        <StatCard
          title="Active Exams"
          value="3"
          subtitle="Currently running"
        />

        <StatCard
          title="Avg Score"
          value="62%"
          subtitle="Last 30 days"
        />

      </div>

      {/* Placeholder sections */}
      <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div className="bg-white rounded-xl border p-5">
          <h2 className="font-semibold text-slate-800 mb-2">
            Recent Exams
          </h2>
          <p className="text-sm text-slate-500">
            Exam activity will appear here.
          </p>
        </div>

        <div className="bg-white rounded-xl border p-5">
          <h2 className="font-semibold text-slate-800 mb-2">
            Performance Overview
          </h2>
          <p className="text-sm text-slate-500">
            Analytics & charts coming soon.
          </p>
        </div>

      </div>
    </>
  );
}
