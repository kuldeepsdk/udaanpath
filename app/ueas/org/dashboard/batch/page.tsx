"use client";

import { useEffect, useState } from "react";
import { getBatchesAction } from "@/app/actions/ueas/batch.actions";
import CreateBatchModal from "./components/CreateBatchModal";

interface Batch {
  id: string;
  name: string;
  description?: string;
  created_at: string;
}

export default function BatchPage() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [openCreate, setOpenCreate] = useState(false);

  async function loadBatches() {
    setLoading(true);
    try {
      const res = await getBatchesAction();
      setBatches(res || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBatches();
  }, []);

  return (
    <>
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Batches</h1>

        <button
          onClick={() => setOpenCreate(true)}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white text-sm font-semibold"
        >
          + Create Batch
        </button>
      </div>

      {/* LIST */}
      <div className="bg-white border rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-6 text-sm text-slate-500">Loading batches…</div>
        ) : batches.length === 0 ? (
          <div className="p-6 text-sm text-slate-500">
            No batches created yet
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left">Batch Name</th>
                <th className="px-4 py-3 text-left">Description</th>
                <th className="px-4 py-3 text-center">Created</th>
              </tr>
            </thead>

            <tbody>
              {batches.map((b) => (
                <tr
                  key={b.id}
                  className="border-b hover:bg-slate-50 cursor-pointer"
                  onClick={() =>
                    (window.location.href =
                      `/ueas/org/dashboard/batch/${b.id}`)
                  }
                >
                  <td className="px-4 py-3 font-medium">{b.name}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {b.description || "-"}
                  </td>
                  <td className="px-4 py-3 text-center text-xs text-slate-500">
                    {new Date(b.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* CREATE MODAL */}
      <CreateBatchModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onCreated={loadBatches}
      />
    </>
  );
}
