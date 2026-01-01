"use client";

import { useTransition } from "react";
import { ueasOrgLogoutAction } from "@/app/actions/ueas/ueasOrgAuth.actions";
import {
  LayoutDashboard,
  Users,
  FileText,
  ClipboardList,
  BarChart3,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();

  function logout() {
    startTransition(() => {
      ueasOrgLogoutAction();
    });
  }

  return (
    <aside className="w-64 bg-white border-r hidden md:flex flex-col">
      <div className="h-16 flex items-center px-6 font-bold text-blue-600 text-lg">
        UEAS Panel
      </div>

      <nav className="flex-1 px-3 space-y-1">
        <NavLink href="/ueas/org/dashboard" label="Dashboard" pathname={pathname} />
        <NavLink href="/ueas/org/dashboard/batch" label="Batches" pathname={pathname} />
        <NavLink href="/ueas/org/dashboard/questions" label="Question Bank" pathname={pathname} />
        <NavLink href="/ueas/org/dashboard/paper" label="Exam Papers" pathname={pathname} />
        <NavLink href="/ueas/org/dashboard/exams" label="Exams" pathname={pathname} />
        <NavLink href="/ueas/org/dashboard/results" label="Results" pathname={pathname} />
      </nav>

      <div className="p-3 border-t">
        <button
          onClick={logout}
          disabled={pending}
          className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-60"
        >
          <LogOut className="h-4 w-4" />
          {pending ? "Logging out..." : "Logout"}
        </button>
      </div>
    </aside>
  );
}

function NavLink({
  href,
  label,
  pathname,
}: {
  href: string;
  label: string;
  pathname: string;
}) {
  const active = pathname === href;
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium
        ${active ? "bg-blue-50 text-blue-600" : "text-slate-600 hover:bg-slate-100"}
      `}
    >
      {label}
    </Link>
  );
}
