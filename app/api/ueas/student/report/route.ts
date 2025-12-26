import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { validateInternalApi } from "@/lib/apiAuth";

function parseJsonArray(val: any): string[] {
  if (!val) return [];
  if (Array.isArray(val)) return val.map(String);
  try {
    const parsed = JSON.parse(val);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

export async function GET(req: Request) {
  // 🔐 Internal API protection
  const auth = await validateInternalApi(req);
  if (!auth.ok) return auth.response;

  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) {
    return NextResponse.json(
      { success: false, error: "Missing token" },
      { status: 401 }
    );
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

  /* ===============================
     Resolve student
  =============================== */
  const [stuRows]: any = await db.execute(
    `
    SELECT id, name, roll_no
    FROM UEAS_students
    WHERE session_token = ?
    LIMIT 1
    `,
    [token]
  );

  if (!stuRows.length) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const student = stuRows[0];

  /* ===============================
     Check exam settings
  =============================== */
  const [examRows]: any = await db.execute(
    `
    SELECT id, name, show_score_after_exam, exam_date, end_time
    FROM UEAS_exams
    WHERE id = ?
    LIMIT 1
    `,
    [exam_id]
  );

  if (!examRows.length) {
    return NextResponse.json(
      { success: false, error: "Exam not found" },
      { status: 404 }
    );
  }

  const exam = examRows[0];

  // ❌ Result visibility check
  if (exam.show_score_after_exam !== 1) {
    return NextResponse.json(
      { success: false, error: "Result not available yet" },
      { status: 403 }
    );
  }

  const examEnd = new Date(`${exam.exam_date}T${exam.end_time}`);
  if (new Date() < examEnd) {
    return NextResponse.json(
      { success: false, error: "Result available after exam ends" },
      { status: 403 }
    );
  }

  /* ===============================
     Exam summary result
  =============================== */
  const [resultRows]: any = await db.execute(
    `
    SELECT total_marks, obtained_marks, percentage, rank_position
    FROM UEAS_exam_results
    WHERE exam_id = ? AND student_id = ?
    LIMIT 1
    `,
    [exam_id, student.id]
  );

  if (!resultRows.length) {
    return NextResponse.json(
      { success: false, error: "Result not calculated yet" },
      { status: 404 }
    );
  }

  const summary = resultRows[0];

  /* ===============================
     Question-wise report
  =============================== */
  const [questionRows]: any = await db.execute(
    `
    SELECT 
      q.id AS question_id,
      q.question_text,
      q.marks,
      q.negative_marks,
      a.selected_options,
      a.is_correct,
      a.marks_awarded
    FROM UEAS_paper_questions pq
    JOIN UEAS_questions q ON q.id = pq.question_id
    LEFT JOIN UEAS_student_answers a
      ON a.question_id = q.id
     AND a.exam_id = ?
     AND a.student_id = ?
    WHERE pq.paper_id = (
      SELECT paper_id FROM UEAS_exams WHERE id = ?
    )
    ORDER BY pq.question_order
    `,
    [exam_id, student.id, exam_id]
  );

  const report = [];

  for (const q of questionRows) {
    const studentSelected = parseJsonArray(q.selected_options);

    const [correctRows]: any = await db.execute(
      `
      SELECT id, option_text
      FROM UEAS_question_options
      WHERE question_id = ? AND is_correct = 1
      ORDER BY option_order
      `,
      [q.question_id]
    );

    const [allOptions]: any = await db.execute(
      `
      SELECT id, option_text
      FROM UEAS_question_options
      WHERE question_id = ?
      ORDER BY option_order
      `,
      [q.question_id]
    );

    let status: "correct" | "wrong" | "skipped" = "skipped";
    if (studentSelected.length > 0) {
      status = q.is_correct === 1 ? "correct" : "wrong";
    }

    report.push({
      question_id: q.question_id,
      question_text: q.question_text,
      options: allOptions,
      student_selected_options: studentSelected,
      correct_options: correctRows,
      status,
      marks_awarded: q.marks_awarded ?? 0,
      negative_marks: q.is_correct === 0 ? q.negative_marks : 0,
    });
  }

  return NextResponse.json(
    {
      success: true,
      exam: {
        id: exam.id,
        name: exam.name,
      },
      student,
      summary,
      questions: report,
    },
    { status: 200 }
  );
}
