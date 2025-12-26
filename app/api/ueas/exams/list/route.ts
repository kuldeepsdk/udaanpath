import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { validateInternalApi } from "@/lib/apiAuth";

export async function GET(req: Request) {
  const auth = await validateInternalApi(req);
  if (!auth.ok) return auth.response;

  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) {
    return NextResponse.json({ success: false, error: "Missing token" }, { status: 401 });
  }

  const db = await getDB();

  const [rows]: any = await db.execute(
    `
    SELECT e.id, e.name, e.exam_date, e.start_time, e.end_time,
           e.status, e.created_at
    FROM UEAS_exams e
    JOIN UEAS_organization_users u ON u.org_id = e.org_id
    WHERE u.session_token = ?
    ORDER BY e.exam_date DESC, e.start_time DESC
    `,
    [token]
  );

  return NextResponse.json(
    { success: true, exams: rows },
    { status: 200 }
  );
}
