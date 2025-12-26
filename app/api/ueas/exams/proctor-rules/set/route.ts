import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import crypto from "crypto";
import { validateInternalApi } from "@/lib/apiAuth";

export async function POST(req: Request) {
  const auth = await validateInternalApi(req);
  if (!auth.ok) return auth.response;

  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return NextResponse.json({ success: false, error: "Missing token" }, { status: 401 });

  let body: any;
  try { body = await req.json(); } catch {
    return NextResponse.json({ success: false, error: "Invalid JSON" }, { status: 400 });
  }

  const { exam_id, max_tab_switches, max_fullscreen_exit, max_refresh, auto_disqualify } = body;
  if (!exam_id) return NextResponse.json({ success: false, error: "exam_id required" }, { status: 400 });

  const db = await getDB();

  // ownership check
  const [own]: any = await db.execute(
    `
    SELECT e.id
    FROM UEAS_exams e
    JOIN UEAS_organization_users u ON u.org_id = e.org_id
    WHERE e.id = ? AND u.session_token = ?
    LIMIT 1
    `,
    [exam_id, token]
  );
  if (!own.length) return NextResponse.json({ success: false, error: "Exam not found" }, { status: 404 });

  const id = crypto.randomUUID().slice(0, 16);

  await db.execute(
    `
    INSERT INTO UEAS_exam_proctor_rules
      (id, exam_id, max_tab_switches, max_fullscreen_exit, max_refresh, auto_disqualify)
    VALUES
      (?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      max_tab_switches = VALUES(max_tab_switches),
      max_fullscreen_exit = VALUES(max_fullscreen_exit),
      max_refresh = VALUES(max_refresh),
      auto_disqualify = VALUES(auto_disqualify)
    `,
    [
      id,
      exam_id,
      Number.isFinite(max_tab_switches) ? max_tab_switches : 5,
      Number.isFinite(max_fullscreen_exit) ? max_fullscreen_exit : 2,
      Number.isFinite(max_refresh) ? max_refresh : 5,
      auto_disqualify === false ? 0 : 1,
    ]
  );

  return NextResponse.json({ success: true, message: "Proctor rules saved" }, { status: 200 });
}
