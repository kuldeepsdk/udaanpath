"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import BatchHeader from "./components/BatchHeader";
import BatchStudentsTable from "./components/BatchStudentsTable";
import AddStudentsModal from "./components/AddStudentsModal";
import BulkUploadModal from "./components/BulkUploadModal";
import { getBatchDetailAction } from "@/app/actions/ueas/batch.actions";

export default function BatchDetailPage() {
  const { batchId } = useParams<{ batchId: string }>();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [openAddStudents, setOpenAddStudents] = useState(false);
  const [openBulkUpload, setOpenBulkUpload] = useState(false);

  async function loadBatch() {
    setLoading(true);
    try {
      const res = await getBatchDetailAction(batchId);
      setData(res);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (batchId) loadBatch();
  }, [batchId]);

  if (loading) {
    return <div className="p-6 text-sm text-slate-500">Loading batch…</div>;
  }

  if (!data) {
    return <div className="p-6 text-red-600">Batch not found</div>;
  }

  return (
    <>
      <BatchHeader
        batch={data.batch}
        onAddStudents={() => setOpenAddStudents(true)}
        onBulkUpload={() => setOpenBulkUpload(true)}
      />

      <BatchStudentsTable
        students={data.students}
        batchId={batchId}
        onChange={loadBatch}
      />

      {/* ADD STUDENTS */}
      <AddStudentsModal
        open={openAddStudents}
        batchId={batchId}
        onClose={() => setOpenAddStudents(false)}
        onAdded={() => {
          setOpenAddStudents(false);
          loadBatch();
        }}
      />

      {/* BULK UPLOAD */}
      <BulkUploadModal
        open={openBulkUpload}
        batchId={batchId}
        onClose={() => setOpenBulkUpload(false)}
        onImported={() => {
          setOpenBulkUpload(false);
          loadBatch();
        }}
      />
    </>
  );
}
