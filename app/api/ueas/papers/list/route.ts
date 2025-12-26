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
    SELECT p.id, p.name, p.total_questions, p.total_marks,
           p.default_duration_minutes, p.created_at
    FROM UEAS_papers p
    JOIN UEAS_organization_users u ON u.org_id = p.org_id
    WHERE u.session_token = ?
    ORDER BY p.created_at DESC
    `,
    [token]
  );

  return NextResponse.json(
    { success: true, papers: rows },
    { status: 200 }
  );
}
