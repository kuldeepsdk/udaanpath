import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { validateInternalApi } from "@/lib/apiAuth";

export async function GET(req: Request) {
  const auth = await validateInternalApi(req);
  if (!auth.ok) return auth.response;

  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return NextResponse.json({ success: false, error: "Missing token" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const exam_id = searchParams.get("exam_id");
  if (!exam_id) return NextResponse.json({ success: false, error: "exam_id required" }, { status: 400 });

  const db = await getDB();

  const [stuRows]: any = await db.execute(
    `SELECT id FROM UEAS_students WHERE session_token = ? LIMIT 1`,
    [token]
  );
  if (!stuRows.length) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  const student_id = stuRows[0].id;

  const [attempt]: any = await db.execute(
    `SELECT status, tab_switch_count, start_time, submit_time
     FROM UEAS_exam_students WHERE exam_id = ? AND student_id = ? LIMIT 1`,
    [exam_id, student_id]
  );

  if (!attempt.length) return NextResponse.json({ success: false, error: "Exam not started" }, { status: 404 });

  const [fs]: any = await db.execute(
    `SELECT COUNT(*) AS c FROM UEAS_exam_activity_logs WHERE exam_id = ? AND student_id = ? AND event_type='fullscreen_exit'`,
    [exam_id, student_id]
  );
  const [rf]: any = await db.execute(
    `SELECT COUNT(*) AS c FROM UEAS_exam_activity_logs WHERE exam_id = ? AND student_id = ? AND event_type='refresh'`,
    [exam_id, student_id]
  );

  return NextResponse.json(
    {
      success: true,
      attempt: attempt[0],
      counts: {
        fullscreen_exit_count: Number(fs[0]?.c || 0),
        refresh_count: Number(rf[0]?.c || 0),
      },
    },
    { status: 200 }
  );
}
