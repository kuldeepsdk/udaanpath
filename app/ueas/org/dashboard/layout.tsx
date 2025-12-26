import Sidebar from "@/app/ueas/org/dashboard/components/Sidebar";
import TopBar from "@/app/ueas/org/dashboard/components/TopBar";

export default function OrgDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">

        <TopBar />

        <main className="p-6">
          {children}
        </main>

      </div>
    </div>
  );
}
