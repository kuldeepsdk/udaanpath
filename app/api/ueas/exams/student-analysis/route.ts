import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { validateInternalApi } from "@/lib/apiAuth";

/* ---------- SAFE PARSER ---------- */
function parseSelectedOptions(raw: any): string[] {
  if (!raw) return [];

  if (Array.isArray(raw)) return raw;

  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [raw];
    } catch {
      return [raw];
    }
  }

  return [];
}

/* ---------- SAFE NUMBER ---------- */
function toNumber(v: any): number {
  if (v === null || v === undefined) return 0;
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

export async function GET(req: Request) {
  try {
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

    const { searchParams } = new URL(req.url);
    const exam_id = searchParams.get("exam_id");
    const roll_no = searchParams.get("roll_no");

    if (!exam_id || !roll_no) {
      return NextResponse.json(
        { success: false, error: "exam_id and roll_no required" },
        { status: 400 }
      );
    }

    const db = await getDB();

    /* ---------- ORG ---------- */
    const [orgRows]: any = await db.execute(
      `
      SELECT org_id
      FROM UEAS_organization_users
      WHERE session_token = ?
      LIMIT 1
      `,
      [token]
    );

    if (!orgRows.length) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    /* ---------- STUDENT ---------- */
    const [stuRows]: any = await db.execute(
      `
      SELECT id, name, roll_no, email
      FROM UEAS_students
      WHERE roll_no = ?
      LIMIT 1
      `,
      [roll_no]
    );

    if (!stuRows.length) {
      return NextResponse.json(
        { success: false, error: "Student not found" },
        { status: 404 }
      );
    }

    const student = stuRows[0];

    /* ---------- ANSWERS + QUESTIONS ---------- */
    const [rows]: any = await db.execute(
      `
      SELECT
        q.id AS question_id,
        q.question_text,
        q.marks,
        sa.selected_options,
        sa.is_correct,
        sa.marks_awarded,

        qo.id AS option_id,
        qo.option_text,
        qo.is_correct AS option_correct

      FROM UEAS_questions q
      JOIN UEAS_paper_questions pq ON pq.question_id = q.id
      JOIN UEAS_exams e ON e.paper_id = pq.paper_id

      LEFT JOIN UEAS_student_answers sa
        ON sa.question_id = q.id
       AND sa.exam_id = e.id
       AND sa.student_id = ?

      LEFT JOIN UEAS_question_options qo
        ON qo.question_id = q.id

      WHERE e.id = ?
      ORDER BY q.id, qo.option_order
      `,
      [student.id, exam_id]
    );

    /* ---------- GROUP + CALC ---------- */
    const questionsMap: any = {};
    let totalMarks = 0;
    let obtainedMarks = 0;

    for (const r of rows) {
      if (!questionsMap[r.question_id]) {
        const qMarks = toNumber(r.marks);
        const awarded = toNumber(r.marks_awarded);

        questionsMap[r.question_id] = {
          id: r.question_id,
          question_text: r.question_text,
          marks: qMarks,
          selected_options: parseSelectedOptions(r.selected_options),
          is_correct: r.is_correct,
          marks_awarded: awarded,
          options: [],
        };

        totalMarks += qMarks;
        obtainedMarks += awarded;
      }

      if (r.option_id) {
        questionsMap[r.question_id].options.push({
          id: r.option_id,
          text: r.option_text,
          is_correct: r.option_correct === 1,
        });
      }
    }

    /* ---------- RESPONSE ---------- */
    return NextResponse.json(
      {
        success: true,
        student: {
          name: student.name,
          roll_no: student.roll_no,
          email: student.email,
        },
        summary: {
          total_marks: Number(totalMarks.toFixed(2)),
          obtained_marks: Number(obtainedMarks.toFixed(2)),
        },
        questions: Object.values(questionsMap),
      },
      { status: 200 }
    );
  } catch (e: any) {
    console.error("❌ Student Analysis API Error:", e);
    return NextResponse.json(
      { success: false, error: e?.message || "Server error" },
      { status: 500 }
    );
  }
}
