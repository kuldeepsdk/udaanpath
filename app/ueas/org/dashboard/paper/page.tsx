"use client";

import { useEffect, useState } from "react";
import PaperFilters from "./components/PaperFilters";
import PaperListTable from "./components/PaperListTable";
import CreatePaperModal from "./components/CreatePaperModal";
import { getPapersAction } from "@/app/actions/ueas/papers.actions";

/* ---------------- Types ---------------- */

interface PaperListFilters {
  search?: string;
  is_active?: 0 | 1;
  page?: number;
  limit?: number;
}

/* ---------------- Page ---------------- */

export default function PaperPage() {
  /* ---------- FILTER STATE ---------- */
  const [filters, setFilters] = useState<{
    search: string;
    is_active?: 0 | 1;
  }>({
    search: "",
    is_active: undefined,
  });

  /* ---------- PAGINATION STATE ---------- */
  const [page, setPage] = useState(1);
  const limit = 10;

  /* ---------- DATA STATE ---------- */
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  /* ---------- MODAL STATE ---------- */
  const [openCreate, setOpenCreate] = useState(false);

  /* ---------- LOAD PAPERS ---------- */
  async function loadPapers(currentPage: number) {
    setLoading(true);

    try {
      const payload: PaperListFilters = {
        search: filters.search || undefined,
        is_active: filters.is_active,
        page: currentPage,
        limit,
      };

      const res = await getPapersAction(payload);
      setData(res);
    } finally {
      setLoading(false);
    }
  }

  /* ---------- Reload on filter change ---------- */
  useEffect(() => {
    setPage(1);         // 🔑 reset page
    loadPapers(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  /* ---------- Pagination handler ---------- */
  function handlePageChange(newPage: number) {
    setPage(newPage);
    loadPapers(newPage);
  }

  return (
    <>
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          Papers
        </h1>

        <button
          onClick={() => setOpenCreate(true)}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white text-sm font-semibold"
        >
          + Create Paper
        </button>
      </div>

      {/* FILTERS */}
      <PaperFilters
        value={filters}
        onChange={setFilters}
      />

      {/* TABLE */}
      <PaperListTable
        data={data}
        loading={loading}
        onPageChange={handlePageChange}
      />

      {/* CREATE MODAL */}
      <CreatePaperModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onCreated={() => loadPapers(1)}
      />
    </>
  );
}
