import { NextResponse } from "next/server";
import { validateAdminApi } from "@/lib/apiAuth";
import { getDB } from "@/lib/db";

export async function GET(req: Request) {
  const auth = await validateAdminApi(req);
  if (!auth.ok) return auth.response;

  const db = await getDB();

  const [rows]: any = await db.execute(`
    SELECT
      sa.id,
      sa.source_id,
      sa.source_name,
      sa.alert_type,
      sa.message,
      sa.detected_at,
      sa.is_resolved
    FROM source_alerts sa
    ORDER BY sa.detected_at DESC
    LIMIT 200
  `);

  return NextResponse.json({
    success: true,
    admin: auth.admin,
    data: rows,
  });
}
