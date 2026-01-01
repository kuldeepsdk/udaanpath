import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { validateInternalApi } from "@/lib/apiAuth";

export async function POST(req: Request) {
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

  const { exam_id } = await req.json();
  if (!exam_id) {
    return NextResponse.json(
      { success: false, error: "exam_id required" },
      { status: 400 }
    );
  }

  const db = await getDB();

  /* ---------- STUDENT FROM SESSION TOKEN ---------- */
  const [stuRows]: any = await db.execute(
    `SELECT id FROM UEAS_students WHERE session_token = ? LIMIT 1`,
    [token]
  );

  if (!stuRows.length) {
    return NextResponse.json(
      { success: false, error: "Unauthorized student" },
      { status: 401 }
    );
  }

  const student_id = stuRows[0].id;

  /* ---------- EXAM ---------- */
  const [examRows]: any = await db.execute(
    `
    SELECT e.*, p.id AS paper_id
    FROM UEAS_exams e
    JOIN UEAS_papers p ON p.id = e.paper_id
    WHERE e.id = ?
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

  /* ---------- TIME WINDOW ---------- */
  const now = new Date();
  const start = new Date(`${exam.exam_date}T${exam.start_time}`);
  const end = new Date(`${exam.exam_date}T${exam.end_time}`);

  if (now < start || now > end) {
    return NextResponse.json(
      { success: false, error: "Exam not active" },
      { status: 403 }
    );
  }

  /* ---------- ELIGIBILITY ---------- */
  const [elig]: any = await db.execute(
    `
    SELECT eb.batch_id
    FROM UEAS_exam_batches eb
    JOIN UEAS_batch_students bs
      ON bs.batch_id = eb.batch_id
    WHERE eb.exam_id = ?
      AND bs.student_id = ?
    LIMIT 1
    `,
    [exam_id, student_id]
  );

  if (!elig.length) {
    return NextResponse.json(
      { success: false, error: "Student not eligible for this exam" },
      { status: 403 }
    );
  }

  const batch_id = elig[0].batch_id;

  /* ---------- EXISTING ATTEMPT ---------- */
  const [attemptRows]: any = await db.execute(
    `
    SELECT exam_status
    FROM UEAS_exam_students
    WHERE exam_id = ? AND student_id = ?
    LIMIT 1
    `,
    [exam_id, student_id]
  );

  if (
    attemptRows.length &&
    attemptRows[0].exam_status === "completed"
  ) {
    return NextResponse.json(
      { success: false, error: "Exam already submitted" },
      { status: 403 }
    );
  }

  if (
    attemptRows.length &&
    attemptRows[0].exam_status === "suspended"
  ) {
    return NextResponse.json(
      { success: false, error: "You are suspended from this exam" },
      { status: 403 }
    );
  }

  /* ---------- CREATE / UPDATE ATTEMPT ---------- */
  await db.execute(
    `
    INSERT INTO UEAS_exam_students
      (id, exam_id, batch_id, student_id, exam_status, started_at)
    VALUES
      (SUBSTRING(UUID(),1,16), ?, ?, ?, 'started', NOW())
    ON DUPLICATE KEY UPDATE
      exam_status = 'started',
      started_at = IFNULL(started_at, NOW()),
      updated_at = NOW()
    `,
    [exam_id, batch_id, student_id]
  );

  /* ---------- QUESTIONS ---------- */
  let qSql = `
    SELECT q.id, q.question_text, q.question_type, q.marks
    FROM UEAS_paper_questions pq
    JOIN UEAS_questions q ON q.id = pq.question_id
    WHERE pq.paper_id = ?
  `;

  if (exam.randomize_questions) qSql += " ORDER BY RAND()";

  const [questions]: any = await db.execute(qSql, [
    exam.paper_id,
  ]);

  for (const q of questions) {
    let oSql = `
      SELECT id, option_text, option_order
      FROM UEAS_question_options
      WHERE question_id = ?
    `;
    if (exam.randomize_options) oSql += " ORDER BY RAND()";

    const [opts]: any = await db.execute(oSql, [q.id]);
    q.options = opts;
  }

  return NextResponse.json(
    {
      success: true,
      exam: {
        id: exam.id,
        name: exam.name,
        duration_minutes: exam.duration_minutes,
      },
      questions,
    },
    { status: 200 }
  );
}
