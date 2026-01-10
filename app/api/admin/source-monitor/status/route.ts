import { NextResponse } from "next/server";
import { validateAdminApi } from "@/lib/apiAuth";
import { getDB } from "@/lib/db";

export async function GET(req: Request) {
  const auth = await validateAdminApi(req);
  if (!auth.ok) return auth.response;

  const db = await getDB();

  const [rows]: any = await db.execute(`
    SELECT *
    FROM source_monitor_runs
    ORDER BY created_at DESC
    LIMIT 1
  `);

  return NextResponse.json({
    success: true,
    run: rows[0] || null,
  });
}
