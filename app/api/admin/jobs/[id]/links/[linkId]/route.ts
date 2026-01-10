import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { validateAdminApi } from "@/lib/apiAuth";
import { deleteCacheByPrefix } from "@/lib/cache";

export async function DELETE(
  req: Request,
  context: {
    params: Promise<{ id: string; linkId: string }>;
  }
) {
  const { id: jobId, linkId } = await context.params;

  const auth = await validateAdminApi(req);
  if (!auth.ok) return auth.response;

  const linkIdNum = Number(linkId);
  if (!linkIdNum) {
    return NextResponse.json(
      { success: false, error: "Invalid link id" },
      { status: 400 }
    );
  }

  const db = await getDB();

  const [result]: any = await db.execute(
    `
    DELETE FROM job_links
    WHERE id = ? AND job_id = ?
    `,
    [linkIdNum, jobId]
  );

  if (result.affectedRows === 0) {
    return NextResponse.json(
      { success: false, error: "Link not found" },
      { status: 404 }
    );
  }

  deleteCacheByPrefix("jobs:");

  return NextResponse.json({
    success: true,
    deleted: true,
  });
}
