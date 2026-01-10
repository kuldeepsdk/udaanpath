import { ReactNode } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getDB } from "@/lib/db";

import AdminNavbar from "@/ui/components/admin/AdminNavbar";
import AdminFooter from "@/ui/components/admin/AdminFooter";

export const metadata = {
  robots: "noindex, nofollow",
};

/* -------------------------------
   Safe DB helper (retry once)
-------------------------------- */
async function safeDbExecute<T>(
  fn: () => Promise<T>,
  retries = 1
): Promise<T> {
  try {
    return await fn();
  } catch (err: any) {
    const code = err?.code || err?.cause?.code;
    if (
      retries > 0 &&
      (code === "ECONNRESET" ||
        code === "PROTOCOL_CONNECTION_LOST")
    ) {
      return await safeDbExecute(fn, retries - 1);
    }
    throw err;
  }
}

export default async function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cookieStore = await cookies();
  const adminSession = cookieStore.get("admin_session")?.value;
  const adminId = cookieStore.get("admin_id")?.value;

  if (!adminSession || !adminId) {
    redirect("/secure-console/login");
  }

  let admin: { id: string; email: string } | null = null;

  try {
    const db = await getDB();

    const [rows]: any = await safeDbExecute(() =>
      db.execute(
        `
        SELECT id, email
        FROM admin_users
        WHERE id = ? AND session_token = ? AND is_active = 1
        LIMIT 1
        `,
        [adminId, adminSession]
      )
    );

    if (rows && rows.length > 0) {
      admin = rows[0];
    }
  } catch (error) {
    // DB unstable → logout instead of crash loop
    redirect("/secure-console/login");
  }

  if (!admin) {
    redirect("/secure-console/login");
  }

  return (
    <div className="bg-slate-100 min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white hidden lg:block">
        <div className="p-5 font-semibold text-lg">
          UdaanPath
        </div>

        <nav className="px-4 space-y-2 text-sm">
          <a
            href="/secure-console/dashboard"
            className="block px-3 py-2 rounded hover:bg-slate-800"
          >
            📊 Dashboard
          </a>
          <a
            href="/secure-console/blogs"
            className="block px-3 py-2 rounded hover:bg-slate-800"
          >
            📝 Blogs
          </a>
          <a
            href="/secure-console/jobs"
            className="block px-3 py-2 rounded hover:bg-slate-800"
          >
            📢 Jobs / Results
          </a>
          {/*
          <a
            href="/secure-console/ads"
            className="block px-3 py-2 rounded hover:bg-slate-800"
          >
            💰 Advertisements
          </a>
          */}
            <a
            href="/secure-console/organizations"
            className="block px-3 py-2 rounded hover:bg-slate-800"
          >
            💰 UEAS
          </a>
            <a
            href="/secure-console/expected-jobs"
            className="block px-3 py-2 rounded hover:bg-slate-800"
          >
            ⏳ Expected Jobs
          </a>
            <a
            href="/secure-console/source-alerts"
            className="block px-3 py-2 rounded hover:bg-slate-800"
          >
            🚨 Source Alerts
          </a>

        </nav>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col">
        <AdminNavbar email={admin.email} />

        <main className="flex-1 p-6">
          {children}
        </main>

        <AdminFooter />
      </div>
    </div>
  );
}
