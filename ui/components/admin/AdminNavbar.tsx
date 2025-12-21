"use client";

import { useState } from "react";
import { adminLogoutAction } from "@/app/actions/admin.actions";

export default function AdminNavbar({
  email,
}: {
  email: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <header className="h-14 bg-white border-b px-6 flex items-center justify-between">
      <div className="text-sm font-semibold text-slate-700">
        UdaanPath Admin Console
      </div>

      {/* Right side */}
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="text-sm text-slate-600 hover:text-slate-900 font-medium"
        >
          {email} ▾
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-44 bg-white border rounded-lg shadow-md text-sm z-50">
            <a
              href="/secure-console/settings"
              className="block px-4 py-2 hover:bg-slate-100"
            >
              ⚙️ Settings
            </a>

            <form action={adminLogoutAction}>
              <button
                type="submit"
                className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600"
              >
                🚪 Logout
              </button>
            </form>
          </div>
        )}
      </div>
    </header>
  );
}
