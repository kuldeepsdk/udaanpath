
//app\ueas\exam\[examId]\components\ExamRuntime.tsx
"use client";

import { useEffect, useState } from "react";
import ExamLoginForm from "./ExamLoginForm";
import ExamStatusBox from "./ExamStatusBox";
import ExamQuestionRunner from "./ExamQuestionRunner";
import ExamCompletedBox from "./ExamCompletedBox";

type AccessState =
  | "not_started"
  | "login_allowed"
  | "login_closed"
  | "completed";

export default function ExamRuntime({
  exam,
  access,
}: {
  exam: any;
  access: any;
}) {
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [now, setNow] = useState<Date>(new Date());

  /* ---------- CHECK SESSION ---------- */
  useEffect(() => {
    const token = sessionStorage.getItem("exam_student_token");
    setSessionToken(token);
  }, []);

  /* ---------- CLOCK TICK ---------- */
  useEffect(() => {
    const t = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const examEnd = new Date(access.exam_end_at);

  /* ---------- TIME OVER ---------- */
  if (now >= examEnd) {
    return <ExamCompletedBox />;
  }

  /* ---------- LOGGED IN → RUN EXAM ---------- */
  if (sessionToken) {
    return (
      <ExamQuestionRunner
        examId={exam.id}
        examEndAt={examEnd}
        exam={exam}
      />
    );
  }

  /* ---------- NOT LOGGED IN ---------- */
  if (access.state === "login_allowed") {
    return (
      <>
        <h2 className="text-lg font-semibold mb-1">
          Student Login
        </h2>
        <p className="text-sm text-slate-500 mb-4">
          Enter your roll number and password to start the exam
        </p>

        <ExamLoginForm
          examId={exam.id}
          onLoginSuccess={() =>
            setSessionToken(
              sessionStorage.getItem("exam_student_token")
            )
          }
        />
      </>
    );
  }

  /* ---------- OTHER STATES ---------- */
  return (
    <ExamStatusBox
      state={access.state as AccessState}
      access={access}
    />
  );
}
