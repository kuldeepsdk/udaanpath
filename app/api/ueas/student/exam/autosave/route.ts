import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { validateInternalApi } from "@/lib/apiAuth";

function normalizeIds(arr: any): string[] {
  if (!Array.isArray(arr)) return [];
  return arr.map(String).filter(Boolean);
}

function intersectionCount(a: string[], b: string[]) {
  const sb = new Set(b);
  let c = 0;
  for (const x of a) if (sb.has(x)) c++;
  return c;
}

function hasAnyWrong(selected: string[], correct: string[]) {
  const sc = new Set(correct);
  return selected.some((x) => !sc.has(x));
}

export async function POST(req: Request) {
  /* ---------- AUTH ---------- */
  const auth = await validateInternalApi(req);
  if (!auth.ok) return auth.response;

  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) {
    return NextResponse.json(
      { success: false, error: "Missing token" },
      { status: 401 }
    );
  }

  /* ---------- BODY ---------- */
  const body = await req.json().catch(() => null);
  const exam_id = body?.exam_id;
  const question_id = body?.question_id;
  const selected_options = normalizeIds(body?.selected_options);

  if (!exam_id || !question_id) {
    return NextResponse.json(
      { success: false, error: "exam_id and question_id required" },
      { status: 400 }
    );
  }

  const db = await getDB();

  /* ---------- RESOLVE STUDENT ---------- */
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

  /* ---------- CHECK EXAM ATTEMPT ---------- */
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

  const exam_status = String(attemptRows[0].exam_status || "");

  if (exam_status === "suspended" || exam_status === "absent") {
    return NextResponse.json(
      { success: false, error: "You are not allowed to save answers" },
      { status: 403 }
    );
  }

  if (exam_status === "completed") {
    return NextResponse.json(
      { success: false, error: "Exam already completed" },
      { status: 403 }
    );
  }

  /* ---------- FETCH EXAM SETTING (NEGATIVE?) ---------- */
  const [examRows]: any = await db.execute(
    `
    SELECT negative_marking
    FROM UEAS_exams
    WHERE id = ?
    LIMIT 1
    `,
    [exam_id]
  );

  const negative_marking =
    examRows.length ? Number(examRows[0].negative_marking) === 1 : false;

  /* ---------- FETCH QUESTION META ---------- */
  const [qRows]: any = await db.execute(
    `
    SELECT id, question_type, marks, negative_marks
    FROM UEAS_questions
    WHERE id = ?
    LIMIT 1
    `,
    [question_id]
  );

  if (!qRows.length) {
    return NextResponse.json(
      { success: false, error: "Question not found" },
      { status: 404 }
    );
  }

  const q = qRows[0];
  const question_type = String(q.question_type); // 'mcq_single' | 'mcq_multi'
  const marks = Number(q.marks ?? 1);
  const negative_marks = Number(q.negative_marks ?? 0);

  /* ---------- VALIDATE OPTIONS BELONG TO QUESTION ---------- */
  if (selected_options.length > 0) {
    const placeholders = selected_options.map(() => "?").join(",");
    const [optCheck]: any = await db.execute(
      `
      SELECT COUNT(*) AS c
      FROM UEAS_question_options
      WHERE question_id = ?
        AND id IN (${placeholders})
      `,
      [question_id, ...selected_options]
    );

    const c = Number(optCheck?.[0]?.c ?? 0);
    if (c !== selected_options.length) {
      return NextResponse.json(
        { success: false, error: "Invalid selected option(s)" },
        { status: 400 }
      );
    }
  }

  /* ---------- GET CORRECT OPTIONS ---------- */
  const [correctRows]: any = await db.execute(
    `
    SELECT id
    FROM UEAS_question_options
    WHERE question_id = ? AND is_correct = 1
    `,
    [question_id]
  );

  const correctIds = correctRows.map((r: any) => String(r.id));

  /* ---------- CALCULATE CORRECTNESS + MARKS ---------- */
  let is_correct = 0;
  let marks_awarded = 0;

  // skipped
  if (selected_options.length === 0) {
    is_correct = 0;
    marks_awarded = 0;
  } else if (question_type === "mcq_single") {
    // must match exactly 1 correct
    is_correct =
      selected_options.length === 1 && correctIds.includes(selected_options[0])
        ? 1
        : 0;

    if (is_correct) {
      marks_awarded = marks;
    } else {
      marks_awarded = negative_marking ? -Math.abs(negative_marks) : 0;
    }
  } else {
    // mcq_multi: PARTIAL MARKING
    const wrong = hasAnyWrong(selected_options, correctIds);
    const correctSelected = intersectionCount(selected_options, correctIds);
    const totalCorrect = Math.max(correctIds.length, 1);

    if (!wrong && correctSelected > 0) {
      // ✅ no wrong selected => partial marks
      marks_awarded = Number(((marks * correctSelected) / totalCorrect).toFixed(2));
      is_correct = correctSelected === totalCorrect ? 1 : 0;
    } else {
      // ❌ any wrong selected => negative (if enabled) else 0
      is_correct = 0;
      marks_awarded = negative_marking ? -Math.abs(negative_marks) : 0;
    }
  }

  /* ---------- UPSERT ANSWER ---------- */
  await db.execute(
    `
    INSERT INTO UEAS_student_answers
      (id, exam_id, student_id, question_id, selected_options, is_correct, marks_awarded, answered_at)
    VALUES
      (SUBSTRING(UUID(),1,16), ?, ?, ?, ?, ?, ?, NOW())
    ON DUPLICATE KEY UPDATE
      selected_options = VALUES(selected_options),
      is_correct = VALUES(is_correct),
      marks_awarded = VALUES(marks_awarded),
      answered_at = NOW()
    `,
    [
      exam_id,
      student_id,
      question_id,
      JSON.stringify(selected_options),
      is_correct,
      marks_awarded,
    ]
  );

  return NextResponse.json(
    {
      success: true,
      message: "Answer autosaved",
      result: {
        question_id,
        is_correct: !!is_correct,
        marks_awarded,
      },
    },
    { status: 200 }
  );
}
