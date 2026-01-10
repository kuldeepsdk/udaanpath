import { NextResponse } from "next/server";
import { validateAdminApi } from "@/lib/apiAuth";
import { getDB } from "@/lib/db";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await validateAdminApi(req);
  if (!auth.ok) return auth.response;

  // ✅ FIX: unwrap params
  const params = await context.params;
  const alertId = Number(params.id);

  if (!alertId) {
    return NextResponse.json(
      { success: false, error: "Invalid alert id" },
      { status: 400 }
    );
  }

  const db = await getDB();

  const [[alert]]: any = await db.execute(
    `
    SELECT id, source_id, source_name
    FROM source_alerts
    WHERE id = ?
    `,
    [alertId]
  );

  if (!alert) {
    return NextResponse.json(
      { success: false, error: "Alert not found" },
      { status: 404 }
    );
  }

  const [jobs]: any = await db.execute(
    `
    SELECT
      ej.id,
      ej.job_key,
      ej.title,
      ej.expected_month,
      ej.expected_year,
      ej.status
    FROM expected_jobs ej
    WHERE ej.source_id = ?
      AND ej.status = 'waiting'
    ORDER BY ej.expected_year ASC
    `,
    [alert.source_id]
  );

  return NextResponse.json({
    success: true,
    alert,
    jobs,
  });
}
