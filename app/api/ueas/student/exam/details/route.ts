import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { validateStudentExamApi } from "@/lib/apiAuth";

/* ---------- IST UTILS ---------- */
function combineDateTimeIST(dateInput: any, time: string): Date {
  let dateStr: string;

  if (dateInput instanceof Date) {
    const y = dateInput.getFullYear();
    const m = String(dateInput.getMonth() + 1).padStart(2, "0");
    const d = String(dateInput.getDate()).padStart(2, "0");
    dateStr = `${y}-${m}-${d}`;
  } else {
    dateStr = String(dateInput).slice(0, 10);
  }

  return new Date(`${dateStr}T${time}+05:30`);
}

export async function GET(req: Request) {
  try {
    /* ---------- AUTH ---------- */
    const auth = await validateStudentExamApi(req);
    if (!auth.ok) return auth.response;

    const { searchParams } = new URL(req.url);
    const exam_id = searchParams.get("exam_id");

    if (!exam_id) {
      return NextResponse.json(
        { success: false, error: "exam_id required" },
        { status: 400 }
      );
    }

    const db = await getDB();

    /* ---------- EXAM + ORG ---------- */
    const [rows]: any = await db.execute(
      `
      SELECT
        e.id,
        e.name,
        e.exam_date,
        e.start_time,
        e.end_time,
        e.duration_minutes,

        e.negative_marking,
        e.show_score_after_exam,
        e.show_answers,
        e.randomize_questions,
        e.randomize_options,

        e.status,

        o.id   AS org_id,
        o.name AS org_name,
        o.logo_base64 AS org_logo

      FROM UEAS_exams e
      JOIN UEAS_organizations o ON o.id = e.org_id
      WHERE e.id = ?
      LIMIT 1
      `,
      [exam_id]
    );

    if (!rows.length) {
      return NextResponse.json(
        { success: false, error: "Invalid exam link" },
        { status: 404 }
      );
    }

    const exam = rows[0];
    const now = new Date();

    /* ---------- TIME WINDOWS ---------- */
    const examStart = combineDateTimeIST(exam.exam_date, exam.start_time);
    const examEnd   = combineDateTimeIST(exam.exam_date, exam.end_time);

    const loginOpen  = new Date(examStart.getTime() - 10 * 60 * 1000);
    const loginClose = new Date(examStart.getTime() + 10 * 60 * 1000);

    let access_state:
      | "not_started"
      | "login_allowed"
      | "login_closed"
      | "completed";

    if (now < loginOpen) {
      access_state = "not_started";
    } else if (now >= loginOpen && now <= loginClose) {
      access_state = "login_allowed";
    } else if (now > loginClose && now < examEnd) {
      access_state = "login_closed";
    } else {
      access_state = "completed";
    }

    /* ---------- RESPONSE ---------- */
    return NextResponse.json(
      {
        success: true,
        server_now: now.toISOString(),

        exam: {
          id: exam.id,
          name: exam.name,
          exam_date: exam.exam_date,
          start_time: exam.start_time,
          end_time: exam.end_time,
          duration_minutes: exam.duration_minutes,

          status: exam.status,

          // 🔥 EXAM RULES
          negative_marking: !!exam.negative_marking,
          show_score_after_exam: !!exam.show_score_after_exam,
          show_answers: !!exam.show_answers,
          randomize_questions: !!exam.randomize_questions,
          randomize_options: !!exam.randomize_options,
        },

        organization: {
          id: exam.org_id,
          name: exam.org_name,
          logo: exam.org_logo,
        },

        access: {
          state: access_state,
          login_open_at: loginOpen.toISOString(),
          login_close_at: loginClose.toISOString(),
          exam_start_at: examStart.toISOString(),
          exam_end_at: examEnd.toISOString(),
        },
      },
      { status: 200 }
    );
  } catch (e: any) {
    console.error("❌ Student Exam Details API Error:", e);
    return NextResponse.json(
      { success: false, error: e?.message || "Server error" },
      { status: 500 }
    );
  }
}
