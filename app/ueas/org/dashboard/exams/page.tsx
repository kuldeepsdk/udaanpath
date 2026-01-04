"use client";

import { useEffect, useState } from "react";
import ExamsTable from "./components/ExamsTable";
import CreateExamModal from "./components/CreateExamModal";
import { getExamsAction } from "@/app/actions/ueas/exams.actions";

export default function ExamsPage() {
  const [exams, setExams] = useState<any[]>([]);
  const [credits, setCredits] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [openCreate, setOpenCreate] = useState(false);

  async function loadExams() {
    setLoading(true);
    try {
      const res = await getExamsAction();
      setExams(res.exams);
      setCredits(res.credits);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadExams();
  }, []);

  const canCreateExam =
    credits?.enabled && credits?.remaining > 0;

  return (
    <>
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Exams
          </h1>

          {credits && (
            <p className="text-sm text-slate-600 mt-1">
              🎫 Exam Credits:{" "}
              <b>{credits.remaining}</b> / {credits.total}
            </p>
          )}
        </div>

        <button
          onClick={() => setOpenCreate(true)}
          disabled={!canCreateExam}
          className={`rounded-lg px-4 py-2 text-sm font-semibold
            ${
              canCreateExam
                ? "bg-blue-600 text-white"
                : "bg-slate-300 text-slate-500 cursor-not-allowed"
            }
          `}
          title={
            !canCreateExam
              ? "No exam credits left. Please purchase more."
              : ""
          }
        >
          + Create Exam
        </button>
      </div>

      {/* TABLE */}
      <ExamsTable exams={exams} loading={loading} />

      {/* CREATE MODAL */}
      {canCreateExam && (
        <CreateExamModal
          open={openCreate}
          onClose={() => setOpenCreate(false)}
          onCreated={loadExams}
          credits={credits}
        />
      )}
    </>
  );
}
