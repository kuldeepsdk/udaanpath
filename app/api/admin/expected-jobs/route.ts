import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { validateAdminApi } from "@/lib/apiAuth";

export async function GET(req: Request) {
  const auth = await validateAdminApi(req);
  if (!auth.ok) return auth.response;

  const url = new URL(req.url);

  const status = url.searchParams.get("status") || "waiting";

  const rawLimit = parseInt(
    url.searchParams.get("limit") || "10",
    10
  );

  // 🔒 HARD LIMIT (SECURITY)
  const limit = Math.min(Math.max(rawLimit, 1), 100);

  const allowedStatus = ["waiting", "released", "delayed"];
  if (!allowedStatus.includes(status)) {
    return NextResponse.json(
      { success: false, error: "Invalid status" },
      { status: 400 }
    );
  }

  const db = await getDB();

  // ❗ IMPORTANT:
  // LIMIT is injected AFTER validation (safe)
  const sql = `
    SELECT
      ej.id,
      ej.job_key,
      ej.title,
      ej.expected_month,
      ej.expected_year,
      ej.status,
      js.name AS source_name,
      js.category
    FROM expected_jobs ej
    JOIN job_sources js ON js.id = ej.source_id
    WHERE ej.status = ?
    ORDER BY
      FIELD(js.priority, 'high', 'medium', 'low'),
      ej.expected_year ASC,
      ej.id DESC
    LIMIT ${limit}
  `;

  const [rows]: any = await db.execute(sql, [status]);

  return NextResponse.json({
    success: true,
    admin: auth.admin,
    data: rows,
  });
}
