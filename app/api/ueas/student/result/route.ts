import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { validateInternalApi } from "@/lib/apiAuth";

export async function GET(req: Request) {
  const auth = await validateInternalApi(req);
  if (!auth.ok) return auth.response;

  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) {
    return NextResponse.json({ success: false, error: "Missing token" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const exam_id = searchParams.get("exam_id");
  if (!exam_id) {
    return NextResponse.json({ success: false, error: "exam_id required" }, { status: 400 });
  }

  const db = await getDB();

  // Student resolve (same assumption as runtime: token matches password_hash)
  const [stuRows]: any = await db.execute(
    `SELECT id, name, roll_no FROM UEAS_students WHERE password_hash = ? LIMIT 1`,
    [token]
  );
  if (!stuRows.length) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  const student = stuRows[0];

  // Exam settings
  const [examRows]: any = await db.execute(
    `SELECT id, exam_date, end_time, show_score_after_exam FROM UEAS_exams WHERE id = ? LIMIT 1`,
    [exam_id]
  );
  if (!examRows.length) {
    return NextResponse.json({ success: false, error: "Exam not found" }, { status: 404 });
  }
  const exam = examRows[0];

  // Must be allowed
  if (exam.show_score_after_exam !== 1) {
    return NextResponse.json(
      { success: false, error: "Result not available yet" },
      { status: 403 }
    );
  }

  // Must be after exam end time
  const now = new Date();
  const end = new Date(`${exam.exam_date}T${exam.end_time}`);
  if (now < end) {
    return NextResponse.json(
      { success: false, error: "Result will be available after exam ends" },
      { status: 403 }
    );
  }

  const [rows]: any = await db.execute(
    `
    SELECT total_marks, obtained_marks, percentage, rank_position
    FROM UEAS_exam_results
    WHERE exam_id = ? AND student_id = ?
    LIMIT 1
    `,
    [exam_id, student.id]
  );

  if (!rows.length) {
    return NextResponse.json(
      { success: false, error: "Result not calculated yet" },
      { status: 404 }
    );
  }

  return NextResponse.json(
    {
      success: true,
      student: { id: student.id, name: student.name, roll_no: student.roll_no },
      result: rows[0],
    },
    { status: 200 }
  );
}
