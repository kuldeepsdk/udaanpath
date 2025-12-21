import { getDB } from "@/lib/db";

export default async function AdminDashboard() {
  console.log("Rendering Admin Dashboard");

  // 🔹 Dummy stats (replace with DB queries later)
  const stats = {
    blogs: 128,
    govtJobs: 342,
    admissions: 57,
    results: 211,
    admitCards: 96,
    courses: 24,
    polls: 18,
    ads: 12,
  };

  const todayActivity = {
    newBlogs: 2,
    newJobs: 6,
    newResults: 4,
    newUsers: 53,
  };

  return (
    <div className="space-y-10">

      {/* ===============================
          Page title
      ================================ */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">
          Admin Dashboard
        </h1>
        <p className="text-sm text-slate-500">
          Overview of platform activity
        </p>
      </div>

      {/* ===============================
          Top statistics grid
      ================================ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard title="Total Blogs" value={stats.blogs} />
        <DashboardCard title="Govt Jobs / Vacancies" value={stats.govtJobs} accent="blue" />
        <DashboardCard title="College Admissions" value={stats.admissions} accent="green" />
        <DashboardCard title="Results Published" value={stats.results} accent="yellow" />
        <DashboardCard title="Admit Cards" value={stats.admitCards} />
        <DashboardCard title="Digital Courses" value={stats.courses} accent="green" />
        <DashboardCard title="Polls Created" value={stats.polls} accent="blue" />
        <DashboardCard title="Active Advertisements" value={stats.ads} accent="yellow" />
      </div>

      {/* ===============================
          Activity overview
      ================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Today activity */}
        <div className="bg-white border rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">
            Today’s Activity
          </h2>

          <ul className="space-y-3 text-sm text-slate-600">
            <li>📝 New blogs published: <b>{todayActivity.newBlogs}</b></li>
            <li>📢 New job notifications: <b>{todayActivity.newJobs}</b></li>
            <li>📄 New results added: <b>{todayActivity.newResults}</b></li>
            <li>👥 New users registered: <b>{todayActivity.newUsers}</b></li>
          </ul>
        </div>

        {/* System info / placeholder */}
        <div className="bg-white border rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">
            System Status
          </h2>

          <ul className="space-y-3 text-sm text-slate-600">
            <li>✅ Platform status: <b>Operational</b></li>
            <li>⚡ API status: <b>Healthy</b></li>
            <li>📦 Database: <b>Connected</b></li>
            <li>🕒 Last deploy: <b>2 days ago</b></li>
          </ul>
        </div>
      </div>

    </div>
  );
}

/* ===============================
   Small reusable card
================================ */
function DashboardCard({
  title,
  value,
  accent = "slate",
}: {
  title: string;
  value: number;
  accent?: "slate" | "green" | "yellow" | "blue";
}) {
  const accentMap: Record<string, string> = {
    slate: "text-slate-800",
    green: "text-green-600",
    yellow: "text-yellow-600",
    blue: "text-blue-600",
  };

  return (
    <div className="bg-white border rounded-xl p-6 shadow-sm">
      <div className="text-sm text-slate-500 mb-2">
        {title}
      </div>
      <div className={`text-3xl font-bold ${accentMap[accent]}`}>
        {value}
      </div>
    </div>
  );
}
