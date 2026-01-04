import { getAdminDashboardAction } from "@/app/actions/admin/dashboard.action";

export default async function AdminDashboard() {
  const data = await getAdminDashboardAction();

  const { stats, today } = data;

  return (
    <div className="space-y-10">

      <div>
        <h1 className="text-2xl font-semibold text-slate-800">
          Admin Dashboard
        </h1>
        <p className="text-sm text-slate-500">
          Live system overview
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <Card title="Blogs" value={stats.blogs} />
        <Card title="Jobs" value={stats.jobs} accent="blue" />
        <Card title="Results" value={stats.results} accent="green" />
        <Card title="Admit Cards" value={stats.admitCards} accent="yellow" />

        <Card title="Organizations" value={stats.orgs} />
        <Card title="Active Orgs" value={stats.activeOrgs} accent="green" />
        <Card title="Exams" value={stats.exams} />
        <Card
          title="Credits Used"
          value={`${stats.credits.used}/${stats.credits.total}`}
          accent="blue"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Box title="Today’s Activity">
          <Item label="Blogs" value={today.blogs} />
          <Item label="Jobs" value={today.jobs} />
          <Item label="Results" value={today.results} />
          <Item label="New Orgs" value={today.orgs} />
        </Box>

        <Box title="System Status">
          <Item label="Platform" value="Operational" />
          <Item label="API" value="Healthy" />
          <Item label="DB" value="Connected" />
        </Box>
      </div>
    </div>
  );
}

/* UI helpers */

function Card({ title, value, accent = "slate" }: any) {
  const map: any = {
    slate: "text-slate-800",
    green: "text-green-600",
    yellow: "text-yellow-600",
    blue: "text-blue-600",
  };
  return (
    <div className="bg-white border rounded-xl p-6">
      <div className="text-sm text-slate-500">{title}</div>
      <div className={`text-3xl font-bold ${map[accent]}`}>
        {value}
      </div>
    </div>
  );
}

function Box({ title, children }: any) {
  return (
    <div className="bg-white border rounded-xl p-6">
      <h2 className="font-semibold mb-4">{title}</h2>
      <div className="space-y-2 text-sm">{children}</div>
    </div>
  );
}

function Item({ label, value }: any) {
  return (
    <div className="flex justify-between">
      <span className="text-slate-500">{label}</span>
      <b>{value}</b>
    </div>
  );
}
