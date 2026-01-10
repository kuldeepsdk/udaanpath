import { NextResponse } from "next/server";
import { validateAdminApi } from "@/lib/apiAuth";
import { getDB } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const auth = await validateAdminApi(req);
  if (!auth.ok) return auth.response;

  const alertId = Number(params.id);
  const body = await req.json();
  const jobId = Number(body.job_id);

  if (!alertId || !jobId) {
    return NextResponse.json(
      { success: false, error: "Invalid input" },
      { status: 400 }
    );
  }

  const db = await getDB();

  // 1️⃣ Mark expected job released
  await db.execute(
    `
    UPDATE expected_jobs
    SET status = 'released',
        published_at = NOW()
    WHERE id = ?
  `,
    [jobId]
  );

  // 2️⃣ Resolve alert
  await db.execute(
    `
    UPDATE source_alerts
    SET is_resolved = 1,
        mapped_job_id = ?,
        resolved_at = NOW()
    WHERE id = ?
  `,
    [jobId, alertId]
  );

  return NextResponse.json({
    success: true,
    message: "Alert mapped & job released",
  });
}
