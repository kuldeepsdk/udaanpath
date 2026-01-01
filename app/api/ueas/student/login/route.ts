// app/api/ueas/student/login/route.ts

import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import crypto from "crypto";
import { validateInternalApi } from "@/lib/apiAuth";

/* ---------- IST SAFE UTILS (SAME AS PUBLIC API) ---------- */

const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

function toDateOnly(d: any): string {
  const date = new Date(d);
  if (isNaN(date.getTime())) {
    throw new Error("Invalid exam_date");
  }

  const istDate = new Date(date.getTime() + IST_OFFSET_MS);
  return istDate.toISOString().split("T")[0];
}

function combineDateTimeIST(dateInput: any, time: string): Date {
  const dateOnly = toDateOnly(dateInput);
  const dt = new Date(`${dateOnly}T${time}`);

  if (isNaN(dt.getTime())) {
    throw new Error(`Invalid datetime: ${dateOnly} ${time}`);
  }

  return new Date(dt.getTime()); // treat as IST
}

/**
 * POST /api/ueas/student/login
 * Exam-aware + IST-safe login (FIXED)
 */
export async function POST(req: Request) {
  try {
    const auth = await validateInternalApi(req);
    if (!auth.ok) return auth.response;

    const body = await req.json();
    const { exam_id, roll_no, password } = body || {};

    if (!exam_id || !roll_no || !password) {
      return NextResponse.json(
        { success: false, error: "exam_id, roll_no and password required" },
        { status: 400 }
      );
    }

    const db = await getDB();

    /* ---------- STUDENT ---------- */
    const [students]: any = await db.execute(
      `
      SELECT id, name, roll_no, password_hash, is_active
      FROM UEAS_students
      WHERE roll_no = ?
      LIMIT 1
      `,
      [roll_no]
    );

    if (!students.length) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const student = students[0];

    if (!student.is_active) {
      return NextResponse.json(
        { success: false, error: "Student account inactive" },
        { status: 403 }
      );
    }

    const hash = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex");

    if (hash !== student.password_hash) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 }
      );
    }

    /* ---------- EXAM + BATCH VALIDATION ---------- */
    const [examRows]: any = await db.execute(
      `
      SELECT
        e.exam_date,
        e.start_time,
        e.end_time,
        e.status
      FROM UEAS_exam_batches eb
      JOIN UEAS_batch_students bs ON bs.batch_id = eb.batch_id
      JOIN UEAS_exams e ON e.id = eb.exam_id
      WHERE eb.exam_id = ?
        AND bs.student_id = ?
      LIMIT 1
      `,
      [exam_id, student.id]
    );

    if (!examRows.length) {
      return NextResponse.json(
        { success: false, error: "Student not assigned to this exam" },
        { status: 403 }
      );
    }

    const exam = examRows[0];

    /* ---------- TIME CALC (FIXED) ---------- */
    const now = new Date(); // ✅ DO NOT add IST offset

    const examStart = combineDateTimeIST(exam.exam_date, exam.start_time);
    const examEnd = combineDateTimeIST(exam.exam_date, exam.end_time);

    const loginOpen = new Date(examStart.getTime() - 10 * 60 * 1000);
    const loginClose = new Date(examStart.getTime() + 10 * 60 * 1000);

    console.log(
      "studentExamLoginAction (FIXED):",
      "now:", now,
      "loginOpen:", loginOpen,
      "loginClose:", loginClose,
      "examStart:", examStart,
      "examEnd:", examEnd
    );

    /* ---------- TIME RULES ---------- */
    if (now < loginOpen) {
      return NextResponse.json(
        { success: false, error: "Exam login has not started yet" },
        { status: 403 }
      );
    }

    if (now > loginClose && now < examEnd) {
      return NextResponse.json(
        { success: false, error: "Login time is over. Exam already started." },
        { status: 403 }
      );
    }

    if (now >= examEnd) {
      return NextResponse.json(
        { success: false, error: "Exam already completed" },
        { status: 403 }
      );
    }

    /* ---------- PREVENT MULTIPLE ATTEMPTS ---------- */
    const [attempts]: any = await db.execute(
      `
      SELECT id, exam_status
      FROM UEAS_exam_students
      WHERE exam_id = ?
        AND student_id = ?
      LIMIT 1
      `,
      [exam_id, student.id]
    );

    if (attempts.length && attempts[0].exam_status === "completed") {
      return NextResponse.json(
        { success: false, error: "Exam already submitted" },
        { status: 403 }
      );
    }

    /* ---------- SESSION ---------- */
    const session_token = crypto.randomBytes(32).toString("hex");

    await db.execute(
      `UPDATE UEAS_students SET session_token = ? WHERE id = ?`,
      [session_token, student.id]
    );

    return NextResponse.json(
      {
        success: true,
        token: session_token,
        student: {
          id: student.id,
          name: student.name,
          roll_no: student.roll_no,
        },
        exam_access: {
          exam_start_at: examStart.toISOString(),
          exam_end_at: examEnd.toISOString(),
          login_close_at: loginClose.toISOString(),
        },
      },
      { status: 200 }
    );
  } catch (e: any) {
    console.error("❌ Student Login Error:", e);
    return NextResponse.json(
      { success: false, error: e?.message || "Server error" },
      { status: 500 }
    );
  }
}
