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
    return NextResponse.json(
      { success: false, error: "exam_id required" },
      { status: 400 }
    );
  }

  const db = await getDB();

  const [[student]]: any = await db.execute(
    `SELECT id FROM UEAS_students WHERE session_token = ? LIMIT 1`,
    [token]
  );

  if (!student) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const [[summary]]: any = await db.execute(
    `
    SELECT
      COALESCE(SUM(marks_awarded), 0) AS obtained_marks,
      (
        SELECT COALESCE(SUM(q.marks), 0)
        FROM UEAS_questions q
        JOIN UEAS_paper_questions pq ON pq.question_id = q.id
        JOIN UEAS_exams e ON e.paper_id = pq.paper_id
        WHERE e.id = ?
      ) AS total_marks
    FROM UEAS_student_answers
    WHERE exam_id = ? AND student_id = ?
    `,
    [exam_id, exam_id, student.id]
  );

  return NextResponse.json({
    success: true,
    summary: {
      obtained: Number(summary.obtained_marks),
      total: Number(summary.total_marks),
    },
  });
}
