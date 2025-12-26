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
    SELECT b.id, b.name, b.description, b.created_at
    FROM UEAS_batches b
    JOIN UEAS_organization_users u ON u.org_id = b.org_id
    WHERE u.session_token = ?
    ORDER BY b.created_at DESC
    `,
    [token]
  );

  return NextResponse.json({ success: true, batches: rows }, { status: 200 });
}
