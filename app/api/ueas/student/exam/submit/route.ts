// app/api/ueas/student/exam/submit/route.ts

import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { validateInternalApi } from "@/lib/apiAuth";

export async function POST(req: Request) {
  /* ---------- AUTH ---------- */
  const auth = await validateInternalApi(req);
  if (!auth.ok) return auth.response;

  const token = req.headers
    .get("authorization")
    ?.replace("Bearer ", "");

  if (!token) {
    return NextResponse.json(
      { success: false, error: "Missing token" },
      { status: 401 }
    );
  }

  const body = await req.json().catch(() => null);
  const exam_id = body?.exam_id;

  if (!exam_id) {
    return NextResponse.json(
      { success: false, error: "exam_id required" },
      { status: 400 }
    );
  }

  const db = await getDB();

  /* ---------- STUDENT FROM SESSION ---------- */
  const [stuRows]: any = await db.execute(
    `
    SELECT id
    FROM UEAS_students
    WHERE session_token = ?
    LIMIT 1
    `,
    [token]
  );

  if (!stuRows.length) {
    return NextResponse.json(
      { success: false, error: "Unauthorized student" },
      { status: 401 }
    );
  }

  const student_id = stuRows[0].id;

  /* ---------- ATTEMPT ---------- */
  const [attemptRows]: any = await db.execute(
    `
    SELECT exam_status
    FROM UEAS_exam_students
    WHERE exam_id = ? AND student_id = ?
    LIMIT 1
    `,
    [exam_id, student_id]
  );

  if (!attemptRows.length) {
    return NextResponse.json(
      { success: false, error: "Exam not started" },
      { status: 403 }
    );
  }

  const exam_status = String(attemptRows[0].exam_status);

  if (exam_status === "suspended") {
    return NextResponse.json(
      { success: false, error: "You are suspended from this exam" },
      { status: 403 }
    );
  }

  if (exam_status === "completed") {
    return NextResponse.json(
      { success: false, error: "Exam already submitted" },
      { status: 403 }
    );
  }

  /* ---------- CALCULATE FINAL TOTAL MARKS ---------- */
  const [[sumRow]]: any = await db.execute(
    `
    SELECT COALESCE(SUM(marks_awarded), 0) AS total_marks
    FROM UEAS_student_answers
    WHERE exam_id = ? AND student_id = ?
    `,
    [exam_id, student_id]
  );

  const total_marks = Number(sumRow?.total_marks ?? 0);

  /* ---------- SUBMIT EXAM ---------- */
  await db.execute(
    `
    UPDATE UEAS_exam_students
    SET
      exam_status = 'completed',
      total_marks = ?,
      submit_time = NOW(),
      updated_at = NOW()
    WHERE exam_id = ? AND student_id = ?
    `,
    [total_marks, exam_id, student_id]
  );

  return NextResponse.json(
    {
      success: true,
      message: "Exam submitted successfully",
      total_marks,
    },
    { status: 200 }
  );
}
