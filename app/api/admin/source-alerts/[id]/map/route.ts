import { NextResponse } from "next/server";
import { validateAdminApi } from "@/lib/apiAuth";
import { getDB } from "@/lib/db";

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await validateAdminApi(req);
  if (!auth.ok) return auth.response;

  const { id } = await context.params;
  const alertId = Number(id);

  if (!alertId) {
    return NextResponse.json(
      { success: false, error: "Invalid alert id" },
      { status: 400 }
    );
  }

  const body = await req.json();
  const jobId = Number(body.job_id);

  if (!jobId) {
    return NextResponse.json(
      { success: false, error: "Invalid job id" },
      { status: 400 }
    );
  }

  const db = await getDB();

  // 1️⃣ Release expected job
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
    message: "Alert mapped and job released",
  });
}
