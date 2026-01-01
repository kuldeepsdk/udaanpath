"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ExamHeader from "./components/ExamHeader";
import ExamBatchesTable from "./components/ExamBatchesTable";
import AssignBatchesModal from "./components/AssignBatchesModal";

import {
  getExamDetailAction,
  sendExamInviteAction,
  sendExamCredentialsAction,
} from "@/app/actions/ueas/exams.actions";

export default function ExamDetailPage() {
  const { examId } = useParams<{ examId: string }>();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [openAssign, setOpenAssign] = useState(false);

  /* ---------------- LOAD EXAM ---------------- */
  async function loadExam() {
    setLoading(true);
    try {
      const res = await getExamDetailAction(examId);
      setData(res);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (examId) loadExam();
  }, [examId]);

  /* ---------------- SEND INVITE (ASYNC) ---------------- */
  async function handleSendInvite(batchId: string) {
    const ok = confirm(
      "Start sending exam invitations to this batch?\n\nEmails will be sent in background."
    );
    if (!ok) return;

    try {
      await sendExamInviteAction(examId, batchId);

      alert(
        "📨 Invitation sending started.\nYou can continue using the dashboard."
      );

      // refresh to show `processing`
      await loadExam();
    } catch (e: any) {
      alert(e.message || "Failed to start invite sending");
    }
  }

  /* ---------------- SEND CREDENTIALS (ASYNC) ---------------- */
  async function handleSendCredentials(batchId: string) {
    const ok = confirm(
      "Start sending exam login credentials to this batch?\n\nThis will run in background."
    );
    if (!ok) return;

    try {
      await sendExamCredentialsAction(examId, batchId);

      alert(
        "🔐 Credentials sending started.\nEmails will be sent in background."
      );

      // refresh to show `processing`
      await loadExam();
    } catch (e: any) {
      alert(e.message || "Failed to start credentials sending");
    }
  }

  /* ---------------- UI ---------------- */

  if (loading) {
    return (
      <div className="p-6 text-sm text-slate-500">
        Loading exam…
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6 text-red-600">
        Exam not found
      </div>
    );
  }

  return (
    <>
      {/* HEADER */}
      <ExamHeader
        exam={data.exam}
        onAssignBatches={() => setOpenAssign(true)}
      />

      {/* ASSIGN BATCH MODAL */}
      <AssignBatchesModal
        open={openAssign}
        examId={examId}
        onClose={() => setOpenAssign(false)}
        onAssigned={loadExam}
      />

      {/* BATCH STATUS TABLE */}
      <ExamBatchesTable
        batches={data.batches}
        onSendInvite={handleSendInvite}
        onSendCredentials={handleSendCredentials}
      />
    </>
  );
}
