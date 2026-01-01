"use client";

import { useEffect, useState } from "react";
import ExamsTable from "./components/ExamsTable";
import CreateExamModal from "./components/CreateExamModal";
import { getExamsAction } from "@/app/actions/ueas/exams.actions";

export default function ExamsPage() {
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openCreate, setOpenCreate] = useState(false);

  async function loadExams() {
    setLoading(true);
    try {
      const res = await getExamsAction();
      setExams(res);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadExams();
  }, []);

  return (
    <>
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          Exams
        </h1>

        <button
          onClick={() => setOpenCreate(true)}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white text-sm font-semibold"
        >
          + Create Exam
        </button>
      </div>

      {/* TABLE */}
      <ExamsTable exams={exams} loading={loading} />

      {/* CREATE MODAL */}
      <CreateExamModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onCreated={loadExams}
      />
    </>
  );
}
