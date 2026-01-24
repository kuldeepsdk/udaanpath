import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { validateAdminApi } from "@/lib/apiAuth";

export async function GET(
  req: Request,
  context: { params: Promise<{ id?: string }> }
) {
  try {
    // 🔥 Next.js 16 FIX: await params
    const params = await context.params;
    const courseId = Number(params?.id);

    if (!courseId || Number.isNaN(courseId)) {
      return NextResponse.json(
        { success: false, error: "Invalid course ID" },
        { status: 400 }
      );
    }

    const auth = await validateAdminApi(req);
    if (!auth.ok) return auth.response;

    const db = await getDB();

    const [rows]: any = await db.execute(
      `
      SELECT id, title, slug, description, is_published
      FROM courseapp_course
      WHERE id = ?
      LIMIT 1
      `,
      [courseId] // ✅ NEVER undefined
    );

    return NextResponse.json({
      success: true,
      data: rows?.[0] || null,
    });
  } catch (err) {
    console.error("Fetch course failed:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}



export async function POST(
  req: Request,
  context: { params: Promise<{ id?: string }> }
) {
  try {
    // 🔥 Next.js 16 FIX: await params
    const params = await context.params;
    const courseId = Number(params?.id);

    if (!courseId || Number.isNaN(courseId)) {
      return NextResponse.json(
        { success: false, error: "Invalid course ID" },
        { status: 400 }
      );
    }

    const auth = await validateAdminApi(req);
    if (!auth.ok) return auth.response;

    const {
      title,
      slug,
      description,
      is_published,
    } = await req.json();

    if (!title || !slug) {
      return NextResponse.json(
        { success: false, error: "Missing fields" },
        { status: 400 }
      );
    }

    const db = await getDB();

    await db.execute(
      `
      UPDATE courseapp_course
      SET
        title = ?,
        slug = ?,
        description = ?,
        is_published = ?
      WHERE id = ?
      `,
      [
        title.trim(),
        slug.trim(),
        description || null,
        is_published ? 1 : 0,
        courseId, // ✅ NEVER undefined
      ]
    );

    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error("Update course failed:", e);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

