import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { validateInternalApi } from "@/lib/apiAuth";

type EventType = "tab_switch" | "fullscreen_exit" | "refresh" | "login" | "logout";

export async function POST(req: Request) {
  const auth = await validateInternalApi(req);
  if (!auth.ok) return auth.response;

  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return NextResponse.json({ success: false, error: "Missing token" }, { status: 401 });

  let body: any;
  try { body = await req.json(); } catch {
    return NextResponse.json({ success: false, error: "Invalid JSON" }, { status: 400 });
  }

  const { exam_id, event_type, metadata } = body as { exam_id: string; event_type: EventType; metadata?: any };
  if (!exam_id || !event_type) {
    return NextResponse.json({ success: false, error: "exam_id and event_type required" }, { status: 400 });
  }

  const allowed: EventType[] = ["tab_switch", "fullscreen_exit", "refresh", "login", "logout"];
  if (!allowed.includes(event_type)) {
    return NextResponse.json({ success: false, error: "Invalid event_type" }, { status: 400 });
  }

  const db = await getDB();

  // ✅ Resolve student by session_token (secure)
  const [stuRows]: any = await db.execute(
    `SELECT id, name, roll_no FROM UEAS_students WHERE session_token = ? LIMIT 1`,
    [token]
  );
  if (!stuRows.length) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  const student = stuRows[0];

  // ✅ Must have exam attempt row
  const [attemptRows]: any = await db.execute(
    `
    SELECT status, tab_switch_count
    FROM UEAS_exam_students
    WHERE exam_id = ? AND student_id = ?
    LIMIT 1
    `,
    [exam_id, student.id]
  );
  if (!attemptRows.length) {
    return NextResponse.json({ success: false, error: "Exam not started" }, { status: 403 });
  }

  const attempt = attemptRows[0];
  if (attempt.status === "submitted") {
    return NextResponse.json({ success: true, message: "Already submitted", status: "submitted" }, { status: 200 });
  }
  if (attempt.status === "disqualified") {
    return NextResponse.json({ success: true, message: "Already disqualified", status: "disqualified" }, { status: 200 });
  }

  // ✅ Load rules (fallback defaults)
  const [ruleRows]: any = await db.execute(
    `SELECT max_tab_switches, max_fullscreen_exit, max_refresh, auto_disqualify
     FROM UEAS_exam_proctor_rules WHERE exam_id = ? LIMIT 1`,
    [exam_id]
  );

  const rules = ruleRows[0] || {
    max_tab_switches: 5,
    max_fullscreen_exit: 2,
    max_refresh: 5,
    auto_disqualify: 1,
  };

  // ✅ Log event
  await db.execute(
    `
    INSERT INTO UEAS_exam_activity_logs
      (id, exam_id, student_id, event_type, metadata)
    VALUES
      (SUBSTRING(UUID(),1,16), ?, ?, ?, ?)
    `,
    [exam_id, student.id, event_type, JSON.stringify(metadata || {})]
  );

  // ✅ Update counters
  if (event_type === "tab_switch") {
    await db.execute(
      `UPDATE UEAS_exam_students SET tab_switch_count = tab_switch_count + 1 WHERE exam_id = ? AND student_id = ?`,
      [exam_id, student.id]
    );
  }

  // fullscreen_exit count via logs
  const [fsCountRows]: any = await db.execute(
    `SELECT COUNT(*) AS c FROM UEAS_exam_activity_logs WHERE exam_id = ? AND student_id = ? AND event_type = 'fullscreen_exit'`,
    [exam_id, student.id]
  );
  const fullscreen_exit_count = Number(fsCountRows[0]?.c || 0);

  const [rfCountRows]: any = await db.execute(
    `SELECT COUNT(*) AS c FROM UEAS_exam_activity_logs WHERE exam_id = ? AND student_id = ? AND event_type = 'refresh'`,
    [exam_id, student.id]
  );
  const refresh_count = Number(rfCountRows[0]?.c || 0);

  const [tsRows]: any = await db.execute(
    `SELECT tab_switch_count FROM UEAS_exam_students WHERE exam_id = ? AND student_id = ? LIMIT 1`,
    [exam_id, student.id]
  );
  const tab_switch_count = Number(tsRows[0]?.tab_switch_count || 0);

  // ✅ Apply rules
  let disqualified = false;
  let reason = "";

  if (rules.auto_disqualify === 1) {
    if (tab_switch_count > Number(rules.max_tab_switches)) {
      disqualified = true;
      reason = "Tab switch limit exceeded";
    } else if (fullscreen_exit_count > Number(rules.max_fullscreen_exit)) {
      disqualified = true;
      reason = "Fullscreen exit limit exceeded";
    } else if (refresh_count > Number(rules.max_refresh)) {
      disqualified = true;
      reason = "Refresh limit exceeded";
    }
  }

  if (disqualified) {
    await db.execute(
      `
      UPDATE UEAS_exam_students
      SET status = 'disqualified', submit_time = NOW()
      WHERE exam_id = ? AND student_id = ?
      `,
      [exam_id, student.id]
    );

    // also log disqualify event
    await db.execute(
      `
      INSERT INTO UEAS_exam_activity_logs
        (id, exam_id, student_id, event_type, metadata)
      VALUES
        (SUBSTRING(UUID(),1,16), ?, ?, 'logout', ?)
      `,
      [exam_id, student.id, JSON.stringify({ system: true, action: "disqualified", reason })]
    );

    return NextResponse.json(
      {
        success: true,
        status: "disqualified",
        reason,
        counts: { tab_switch_count, fullscreen_exit_count, refresh_count },
      },
      { status: 200 }
    );
  }

  return NextResponse.json(
    {
      success: true,
      status: "in_progress",
      counts: { tab_switch_count, fullscreen_exit_count, refresh_count },
    },
    { status: 200 }
  );
}
