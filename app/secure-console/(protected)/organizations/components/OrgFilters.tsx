"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function OrgFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(
    searchParams.get("q") || ""
  );
  const [status, setStatus] = useState(
    searchParams.get("status") || "all"
  );

  /* ---------- APPLY FILTERS ---------- */
  function applyFilters() {
    const params = new URLSearchParams();

    if (search.trim()) params.set("q", search.trim());
    if (status !== "all") params.set("status", status);

    // pagination reset
    params.set("page", "1");

    router.push(
      `/secure-console/organizations?${params.toString()}`
    );
  }

  /* ---------- AUTO APPLY ON STATUS CHANGE ---------- */
  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return (
    <div className="bg-white border rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center">

      {/* SEARCH */}
      <div className="flex-1 w-full">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") applyFilters();
          }}
          placeholder="Search organization name or email…"
          className="w-full border rounded-lg px-3 py-2 text-sm
                     focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* STATUS FILTER */}
      <div className="w-full md:w-48">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 text-sm
                     focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="blocked">Blocked</option>
        </select>
      </div>

      {/* APPLY BUTTON (for search) */}
      <button
        onClick={applyFilters}
        className="px-4 py-2 bg-slate-900 text-white
                   rounded-lg text-sm hover:bg-slate-800"
      >
        Apply
      </button>
    </div>
  );
}
