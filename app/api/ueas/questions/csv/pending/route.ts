import { NextResponse } from "next/server";
import { validateInternalApi } from "@/lib/apiAuth";
import { getDB } from "@/lib/db";

export async function GET(req: Request) {
  const auth = await validateInternalApi(req);
  if (!auth.ok) return auth.response;

  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return NextResponse.json({ success: false }, { status: 401 });

  const db = await getDB();

  const [rows]: any = await db.execute(`
    SELECT id, status, total_rows, imported_rows, failed_rows, created_at
    FROM UEAS_question_csv_uploads
    WHERE org_id = (
      SELECT org_id FROM UEAS_organization_users WHERE session_token = ?
    )
    AND status = 'pending'
    ORDER BY created_at DESC
  `, [token]);

  return NextResponse.json({ success: true, uploads: rows });
}
