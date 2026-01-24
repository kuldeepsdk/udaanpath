import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { validateAdminApi } from "@/lib/apiAuth";

export async function GET(
  req: Request,
  context: { params: Promise<{ id?: string }> }
) {
  try {
    const params = await context.params;
    const courseId = Number(params?.id);

    if (!courseId) {
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
      SELECT sc.id, sc.name, sc.slug
      FROM courseapp_course_categories cc
      JOIN courseapp_studycategory sc
        ON sc.id = cc.studycategory_id
      WHERE cc.course_id = ?
      `,
      [courseId]
    );

    return NextResponse.json({
      success: true,
      data: rows,
    });
  } catch (e) {
    console.error("Fetch course categories failed:", e);
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
    const params = await context.params;
    const courseId = Number(params?.id);

    if (!courseId) {
      return NextResponse.json(
        { success: false, error: "Invalid course ID" },
        { status: 400 }
      );
    }

    const auth = await validateAdminApi(req);
    if (!auth.ok) return auth.response;

    const { category_ids } = await req.json();

    if (!Array.isArray(category_ids)) {
      return NextResponse.json(
        { success: false, error: "category_ids must be array" },
        { status: 400 }
      );
    }

    const db = await getDB();

    // 🔥 Reset mapping
    await db.execute(
      `DELETE FROM courseapp_course_categories WHERE course_id = ?`,
      [courseId]
    );

    // 🔥 Insert new mapping
    for (const catId of category_ids) {
      await db.execute(
        `
        INSERT INTO courseapp_course_categories
          (course_id, studycategory_id)
        VALUES (?, ?)
        `,
        [courseId, catId]
      );
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Update course categories failed:", e);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
