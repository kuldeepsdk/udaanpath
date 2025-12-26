import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { validateInternalApi } from "@/lib/apiAuth";

export async function GET(req: Request) {
  const auth = await validateInternalApi(req);
  if (!auth.ok) return auth.response;

  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) {
    return NextResponse.json(
      { success: false, error: "Missing token" },
      { status: 401 }
    );
  }

  const db = await getDB();

  const [rows]: any = await db.execute(
    `
    SELECT 
      u.id,
      u.name,
      u.email,
      u.mobile,
      u.role,
      o.id AS org_id,
      o.name AS org_name,
      o.slug,
      o.type,
      o.status
    FROM UEAS_organization_users u
    JOIN UEAS_organizations o ON o.id = u.org_id
    WHERE u.session_token = ?
    LIMIT 1
    `,
    [token]
  );

  if (!rows || rows.length === 0) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  return NextResponse.json(
    {
      success: true,
      user: rows[0],
    },
    { status: 200 }
  );
}
