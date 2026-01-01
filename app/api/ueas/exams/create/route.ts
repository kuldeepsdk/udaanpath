//app\api\ueas\exams\create\route.ts
import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import crypto from "crypto";
import { validateInternalApi } from "@/lib/apiAuth";

export async function POST(req: Request) {
  const auth = await validateInternalApi(req);
  if (!auth.ok) return auth.response;

  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) {
    return NextResponse.json({ success: false, error: "Missing token" }, { status: 401 });
  }

  const body = await req.json();
  const {
    name,
    paper_id,
    exam_date,
    start_time,
    end_time,
    duration_minutes,
    show_score_after_exam,
    show_answers,
    negative_marking,
    randomize_questions,
    randomize_options,
  } = body;

  if (!name || !paper_id || !exam_date || !start_time || !end_time) {
    return NextResponse.json(
      { success: false, error: "Missing required exam fields" },
      { status: 400 }
    );
  }

  const db = await getDB();

  const [orgRows]: any = await db.execute(
    `SELECT org_id FROM UEAS_organization_users WHERE session_token = ? LIMIT 1`,
    [token]
  );

  if (!orgRows.length) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const examId = crypto.randomUUID().slice(0, 16);

  await db.execute(
    `
    INSERT INTO UEAS_exams
    (
      id, org_id, paper_id, name,
      exam_date, start_time, end_time, duration_minutes,
      show_score_after_exam, show_answers, negative_marking,
      randomize_questions, randomize_options
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      examId,
      orgRows[0].org_id,
      paper_id,
      name,
      exam_date,
      start_time,
      end_time,
      duration_minutes || 60,
      show_score_after_exam ? 1 : 0,
      show_answers ? 1 : 0,
      negative_marking ? 1 : 0,
      randomize_questions !== false ? 1 : 0,
      randomize_options !== false ? 1 : 0,
    ]
  );

  return NextResponse.json(
    {
      success: true,
      exam: {
        id: examId,
        name,
        exam_date,
        start_time,
        end_time,
      },
    },
    { status: 201 }
  );
}
