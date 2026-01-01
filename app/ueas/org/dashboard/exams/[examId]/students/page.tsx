"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import ExamStudentsHeader from "./ExamStudentsHeader";
import ExamStudentsTable from "./ExamStudentsTable";
import { getExamStudentsAction } from "@/app/actions/ueas/examsStudents.actions";

export default function ExamStudentsPage() {
  const params = useParams<{ examId: string }>();
  const examId = params?.examId;

  /* ---------------- STATE ---------------- */
  const [students, setStudents] = useState<any[]>([]);
  const [total, setTotal] = useState(0);

  const [page, setPage] = useState(1);
  const [limit] = useState(20);

  const [search, setSearch] = useState("");
  const [inviteStatus, setInviteStatus] = useState("");
  const [credentialsStatus, setCredentialsStatus] = useState("");
  const [examStatus, setExamStatus] = useState("");

  const [loading, setLoading] = useState(false);

  /* ---------------- LOAD DATA ---------------- */
  async function loadStudents() {
    if (!examId) return; // ⛔ prevent undefined API call

    setLoading(true);
    try {
      const res = await getExamStudentsAction({
        exam_id: examId,
        page,
        limit,
        search,
        invite_status: inviteStatus,
        credentials_status: credentialsStatus,
        exam_status: examStatus,
      });

      setStudents(res.students || []);
      setTotal(res.total || 0);
    } finally {
      setLoading(false);
    }
  }

  /* Reload on dependency change */
  useEffect(() => {
    loadStudents();
  }, [examId, page, search, inviteStatus, credentialsStatus, examStatus]);

  if (!examId) {
    return (
      <div className="p-6 text-sm text-slate-500">
        Loading exam…
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* PAGE TITLE */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Exam Students
        </h1>
        <p className="text-sm text-slate-600">
          Student participation, invite & exam status
        </p>
      </div>

      {/* FILTERS */}
      <ExamStudentsHeader
        search={search}
        inviteStatus={inviteStatus}
        credentialsStatus={credentialsStatus}
        examStatus={examStatus}
        onSearchChange={setSearch}
        onInviteStatusChange={setInviteStatus}
        onCredentialsStatusChange={setCredentialsStatus}
        onExamStatusChange={setExamStatus}
        onReset={() => {
          setSearch("");
          setInviteStatus("");
          setCredentialsStatus("");
          setExamStatus("");
          setPage(1);
        }}
      />

      {/* TABLE */}
      <ExamStudentsTable
        examId={examId}
        students={students}
        loading={loading}
        page={page}
        limit={limit}
        total={total}
        onPageChange={setPage}
      />
    </div>
  );
}
