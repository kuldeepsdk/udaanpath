// app/exam/[exam_id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type ExamGateState =
  | "INVALID"
  | "NOT_ACTIVE"
  | "LOGIN_OPEN"
  | "LOGIN_CLOSED"
  | "COMPLETED"
  | "SUSPENDED";

export default function ExamGatePage() {
  const { exam_id } = useParams<{ exam_id: string }>();

  const [loading, setLoading] = useState(true);
  const [state, setState] = useState<ExamGateState>("INVALID");
  const [data, setData] = useState<any>(null);

  async function loadExam() {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/exam/public/detail?exam_id=${exam_id}`,
        { cache: "no-store" }
      );
      const json = await res.json();

      if (!res.ok || !json.success) {
        setState("INVALID");
        return;
      }

      setData(json);

      const now = new Date(json.server_now).getTime();
      const start = new Date(
        `${json.exam.exam_date.split("T")[0]}T${json.exam.start_time}`
      ).getTime();
      const end = new Date(
        `${json.exam.exam_date.split("T")[0]}T${json.exam.end_time}`
      ).getTime();

      const loginOpen = start - 10 * 60 * 1000;
      const loginClose = start + 10 * 60 * 1000;

      if (json.exam.status === "suspended") {
        setState("SUSPENDED");
      } else if (now < loginOpen) {
        setState("NOT_ACTIVE");
      } else if (now >= loginOpen && now <= loginClose) {
        setState("LOGIN_OPEN");
      } else if (now > loginClose && now < end) {
        setState("LOGIN_CLOSED");
      } else {
        setState("COMPLETED");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (exam_id) loadExam();
  }, [exam_id]);

  if (loading) {
    return <div className="p-8 text-center">Loading exam…</div>;
  }

  /* ---------- UI STATES ---------- */

  if (state === "INVALID") {
    return <ErrorBox title="Invalid Exam Link" />;
  }

  if (state === "NOT_ACTIVE") {
    return <InfoBox title="Exam Not Active Yet" />;
  }

  if (state === "LOGIN_OPEN") {
    return <LoginBox exam={data.exam} org={data.organization} />;
  }

  if (state === "LOGIN_CLOSED") {
    return <ErrorBox title="Login Window Closed" />;
  }

  if (state === "COMPLETED") {
    return <InfoBox title="Exam Completed" />;
  }

  if (state === "SUSPENDED") {
    return <ErrorBox title="Exam Suspended" />;
  }

  return null;
}

/* ---------- PLACEHOLDER COMPONENTS ---------- */

function LoginBox({ exam, org }: any) {
  return (
    <div className="max-w-md mx-auto bg-white border rounded-xl p-6">
      <h1 className="text-xl font-bold mb-2">{exam.name}</h1>
      <p className="text-sm text-slate-600 mb-4">
        Organized by {org.name}
      </p>

      <input
        placeholder="Roll No"
        className="w-full border rounded px-3 py-2 mb-3"
      />
      <input
        placeholder="Password"
        type="password"
        className="w-full border rounded px-3 py-2 mb-4"
      />

      <button className="w-full bg-blue-600 text-white py-2 rounded">
        Start Exam
      </button>
    </div>
  );
}

function ErrorBox({ title }: { title: string }) {
  return (
    <div className="p-10 text-center text-red-600 font-semibold">
      {title}
    </div>
  );
}

function InfoBox({ title }: { title: string }) {
  return (
    <div className="p-10 text-center text-slate-600 font-semibold">
      {title}
    </div>
  );
}
