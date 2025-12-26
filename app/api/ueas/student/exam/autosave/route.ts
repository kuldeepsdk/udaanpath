import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { validateInternalApi } from "@/lib/apiAuth";

export async function POST(req: Request) {
  const auth = await validateInternalApi(req);
  if (!auth.ok) return auth.response;

  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) {
    return NextResponse.json({ success: false, error: "Missing token" }, { status: 401 });
  }

  const { exam_id, question_id, selected_options } = await req.json();
  if (!exam_id || !question_id) {
    return NextResponse.json(
      { success: false, error: "exam_id and question_id required" },
      { status: 400 }
    );
  }

  const db = await getDB();

  // resolve student
  const [stuRows]: any = await db.execute(
    `SELECT id FROM UEAS_students WHERE password_hash = ? LIMIT 1`,
    [token]
  );
  if (!stuRows.length) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  const student_id = stuRows[0].id;

  // 🔒 Disqualified students cannot autosave
    const [attemptRows]: any = await db.execute(
    `
    SELECT status
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

    if (attemptRows[0].status === "disqualified") {
    return NextResponse.json(
        {
        success: false,
        error: "You are disqualified from this exam",
        status: "disqualified",
        },
        { status: 403 }
    );
    }


  await db.execute(
    `
    INSERT INTO UEAS_student_answers
      (id, exam_id, student_id, question_id, selected_options, answered_at)
    VALUES
      (SUBSTRING(UUID(),1,16), ?, ?, ?, ?, NOW())
    ON DUPLICATE KEY UPDATE
      selected_options = VALUES(selected_options),
      answered_at = NOW()
    `,
    [exam_id, student_id, question_id, JSON.stringify(selected_options || [])]
  );

  return NextResponse.json(
    { success: true, message: "Answer autosaved" },
    { status: 200 }
  );
}
