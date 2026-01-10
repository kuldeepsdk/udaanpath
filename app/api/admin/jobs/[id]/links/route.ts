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

  const { link_type, label, url } = await req.json();

  if (!link_type || !url) {
    return NextResponse.json(
      { success: false, error: "Missing link data" },
      { status: 400 }
    );
  }

  const db = await getDB();

  await db.execute(
    `
    INSERT INTO job_links
    (job_id, link_type, label, url)
    VALUES (?, ?, ?, ?)
    `,
    [jobId, link_type, label || null, url]
  );

  deleteCacheByPrefix("jobs:");

  return NextResponse.json({ success: true });
}
