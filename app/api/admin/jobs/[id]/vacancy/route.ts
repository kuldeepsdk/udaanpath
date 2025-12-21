// app/api/admin/jobs/[id]/vacancy/route.ts
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

  const { post_name, total_posts } = await req.json();

  if (!post_name || total_posts === undefined) {
    return NextResponse.json(
      { success: false, error: "Missing vacancy data" },
      { status: 400 }
    );
  }

  const db = await getDB();

  await db.execute(
    `
    INSERT INTO job_vacancy_breakup
    (job_id, post_name, total_posts)
    VALUES (?, ?, ?)
    `,
    [jobId, post_name, total_posts]
  );

  deleteCacheByPrefix("jobs:");

  return NextResponse.json({ success: true });
}
