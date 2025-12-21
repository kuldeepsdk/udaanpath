// app/api/admin/jobs/[id]/dates/route.ts 
import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { validateAdminApi } from "@/lib/apiAuth";
import { deleteCacheByPrefix } from "@/lib/cache";

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id: jobId } = await context.params;

  const auth = await validateAdminApi(req);
  if (!auth.ok) return auth.response;

  const { event_key, event_label, event_date } = await req.json();

  if (!event_key || !event_label) {
    return NextResponse.json(
      { success: false, error: "Missing date fields" },
      { status: 400 }
    );
  }

  const db = await getDB();

  await db.execute(
    `
    INSERT INTO job_important_dates
    (job_id, event_key, event_label, event_date)
    VALUES (?, ?, ?, ?)
    `,
    [jobId, event_key, event_label, event_date || null]
  );

  deleteCacheByPrefix("jobs:");

  return NextResponse.json({ success: true });
}
