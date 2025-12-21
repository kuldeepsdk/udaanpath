import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { validateAdminApi } from "@/lib/apiAuth";

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  // 🔥 REQUIRED IN NEXT.JS 16
  const { id } = await context.params;

  // 🔐 Admin validation
  const auth = await validateAdminApi(req);
  if (!auth.ok) return auth.response;

  if (!id) {
    return NextResponse.json(
      { success: false, error: "Missing blog id" },
      { status: 400 }
    );
  }

  const body = await req.json();
  const published = Number(body.published);

  if (published !== 0 && published !== 1) {
    return NextResponse.json(
      { success: false, error: "Invalid published value" },
      { status: 400 }
    );
  }

  const db = await getDB();

  const [result]: any = await db.execute(
    `
    UPDATE blogapp_post
    SET published = ?, updated_at = NOW()
    WHERE id = ?
    `,
    [published, id]
  );

  if (result.affectedRows === 0) {
    return NextResponse.json(
      { success: false, error: "Blog not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    blogId: id,
    published,
  });
}
