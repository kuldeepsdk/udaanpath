"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ExamInfoCard from "./components/ExamInfoCard";
import ExamLoginForm from "./components/ExamLoginForm";
import ExamStatusBox from "./components/ExamStatusBox";
import { getPublicExamDetailAction } from "@/app/actions/ueas/exam/publicExam.actions";
import ExamRuntime from "./components/ExamRuntime";

export default function PublicExamPage() {
  const { examId } = useParams<{ examId: string }>();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  /* ---------- CHECK SESSION ---------- */
  useEffect(() => {
    const token = sessionStorage.getItem("exam_student_token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  async function loadExam() {
    setLoading(true);
    setError("");

    try {
      const res = await getPublicExamDetailAction(examId);
      setData(res);
    } catch (e: any) {
      setError(e.message || "Invalid exam link");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (examId) loadExam();
  }, [examId]);

  /* ---------- LOADING ---------- */
  if (loading) {
    return <CenteredBox text="Loading exam details…" />;
  }

  /* ---------- ERROR ---------- */
  if (error || !data) {
    return (
      <CenteredBox
        error
        text={error || "Invalid exam link. Please verify the URL provided."}
      />
    );
  }

  const { exam, organization, access } = data;

  return (
    <div className="w-full max-w-2xl space-y-6">

      {/* ORG + EXAM INFO */}
      <ExamInfoCard exam={exam} organization={organization} />

      {/* MAIN CONTENT */}
      <div className="bg-white border rounded-xl p-6 shadow-sm">

        {/* ✅ LOGGED IN → EXAM UI */}
        {isLoggedIn ? (
          <ExamRuntime
            exam={exam}
            access={access}
          />
        ) : access.state === "login_allowed" ? (
          <>
            <h2 className="text-lg font-semibold text-slate-900 mb-1">
              Student Login
            </h2>
            <p className="text-sm text-slate-500 mb-4">
              Enter your roll number and password to start the exam
            </p>

            <ExamLoginForm
              examId={exam.id}
              onLoginSuccess={() => setIsLoggedIn(true)}
            />
          </>
        ) : (
          <ExamStatusBox state={access.state} access={access} />
        )}
      </div>

      {/* SECURITY NOTICE */}
      <div className="text-xs text-slate-500 text-center leading-relaxed">
        ⚠️ This is a secure examination environment.
        <br />
        Do not refresh, close the browser, or switch tabs once the exam begins.
      </div>
    </div>
  );
}

/* ---------- HELPERS ---------- */

function CenteredBox({ text, error }: { text: string; error?: boolean }) {
  return (
    <div className="w-full max-w-md bg-white border rounded-xl p-6 text-center shadow-sm">
      <div className={`text-sm ${error ? "text-red-600" : "text-slate-600"}`}>
        {text}
      </div>
    </div>
  );
}

/* ---------- PLACEHOLDER EXAM UI ---------- */
function ExamStartedBox() {
  return (
    <div className="text-center space-y-3">
      <h2 className="text-lg font-semibold text-green-700">
        ✅ Exam Session Started
      </h2>
      <p className="text-sm text-slate-600">
        You are successfully logged in.  
        Exam interface will load here.
      </p>
    </div>
  );
}
