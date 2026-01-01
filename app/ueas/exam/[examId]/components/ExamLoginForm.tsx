"use client";

import { useState } from "react";
import { studentExamLoginAction } from "@/app/actions/ueas/exam/login.actions";

export default function ExamLoginForm({
  examId,
  onLoginSuccess,
}: {
  examId: string;
  onLoginSuccess: () => void;
}) {
  const [rollNo, setRollNo] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    if (!rollNo.trim() || !password) {
      setError("Roll number and password are required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await studentExamLoginAction({
        exam_id: examId,
        roll_no: rollNo.trim(),
        password,
      });

      /* 🔐 SAVE EXAM SESSION (TAB-SCOPED) */
      sessionStorage.setItem("exam_student_token", res.token);

      /* ℹ️ SAVE STUDENT INFO (OPTIONAL BUT USEFUL) */
      sessionStorage.setItem(
        "exam_student_info",
        JSON.stringify(res.student)
      );

      /* ⏱️ SAVE EXAM ACCESS WINDOW */
      sessionStorage.setItem(
        "exam_access",
        JSON.stringify(res.exam_access)
      );

      // ✅ Inform parent → switch UI to exam runtime
      onLoginSuccess();
    } catch (e: any) {
      setError(e?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">

      {/* ERROR */}
      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </div>
      )}

      {/* ROLL NO */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Roll Number
        </label>
        <input
          value={rollNo}
          onChange={(e) => setRollNo(e.target.value)}
          placeholder="e.g. FCFF-UDAANT-0001"
          autoComplete="off"
          className="w-full border rounded-lg px-3 py-2 text-sm
                     focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* PASSWORD */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password sent to your email"
          autoComplete="off"
          className="w-full border rounded-lg px-3 py-2 text-sm
                     focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* ACTION */}
      <button
        onClick={submit}
        disabled={loading}
        className="w-full rounded-lg bg-blue-600 text-white py-2 text-sm
                   font-medium hover:bg-blue-700 disabled:opacity-60"
      >
        {loading ? "Verifying…" : "Start Exam"}
      </button>

      {/* INFO */}
      <p className="text-xs text-slate-500 text-center leading-relaxed">
        Login is allowed only during the exam time window.
        <br />
        Do not refresh or open this exam in multiple tabs.
      </p>
    </div>
  );
}
