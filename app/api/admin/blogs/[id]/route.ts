import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { validateAdminApi } from "@/lib/apiAuth";
import { deleteCacheByPrefix } from "@/lib/cache";

/* --------------------------------
   DELETE BLOG
--------------------------------- */
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  // 🔥 Next.js 16: params is async
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

  const db = await getDB();

  const [result]: any = await db.execute(
    `
    DELETE FROM blogapp_post
    WHERE id = ?
    `,
    [id]
  );

  if (result.affectedRows === 0) {
    return NextResponse.json(
      { success: false, error: "Blog not found" },
      { status: 404 }
    );
  }

  // 🔥 invalidate cache
    deleteCacheByPrefix("blogs:");


  return NextResponse.json({
    success: true,
    blogId: id,
  });
}
