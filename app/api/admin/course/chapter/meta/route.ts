import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { validateAdminApi } from "@/lib/apiAuth";

export async function POST(req: Request) {
  try {
    const auth = await validateAdminApi(req);
    if (!auth.ok) return auth.response;

    const { chapter_uuid, title, order, is_published } =
      await req.json();

    if (!chapter_uuid || !title) {
      return NextResponse.json(
        { success: false, error: "Missing fields" },
        { status: 400 }
      );
    }

    const db = await getDB();

    await db.execute(
      `
      UPDATE courseapp_chapter
      SET
        title = ?,
        \`order\` = ?,
        is_published = ?
      WHERE uuid = ?
      `,
      [
        title.trim(),
        Number(order) || 1,
        is_published ? 1 : 0,
        chapter_uuid,
      ]
    );

    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error("Update chapter meta failed:", e);
    return NextResponse.json(
      { success: false, error: e.message },
      { status: 500 }
    );
  }
}
