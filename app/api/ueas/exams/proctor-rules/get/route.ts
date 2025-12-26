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

  const [rows]: any = await db.execute(
    `SELECT max_tab_switches, max_fullscreen_exit, max_refresh, auto_disqualify
     FROM UEAS_exam_proctor_rules WHERE exam_id = ? LIMIT 1`,
    [exam_id]
  );

  return NextResponse.json(
    { success: true, rules: rows[0] || { max_tab_switches: 5, max_fullscreen_exit: 2, max_refresh: 5, auto_disqualify: 1 } },
    { status: 200 }
  );
}
