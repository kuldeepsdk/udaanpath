import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { validateAdminApi } from "@/lib/apiAuth";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const auth = await validateAdminApi(req);
    if (!auth.ok) return auth.response;

    const { course_id, title, order } = await req.json();

    if (!course_id || !title) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const db = await getDB();

    // 🔢 Auto-calc order if not provided
    let finalOrder = Number(order);
    if (!finalOrder) {
      const [rows]: any = await db.execute(
        `
        SELECT COALESCE(MAX(\`order\`), 0) AS max_order
        FROM courseapp_chapter
        WHERE course_id = ?
        `,
        [course_id]
      );
      finalOrder = rows[0].max_order + 1;
    }

    // uuid column exists in table
    const uuid = crypto.randomBytes(16).toString("hex");

    await db.execute(
      `
      INSERT INTO courseapp_chapter
        (uuid, course_id, title, \`order\`, is_published)
      VALUES (?, ?, ?, ?, 0)
      `,
      [uuid, course_id, title.trim(), finalOrder]
    );

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Create chapter failed:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}


export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const courseId = Number(searchParams.get("course_id"));

    if (!courseId) {
      return NextResponse.json(
        { success: false, data: [] },
        { status: 400 }
      );
    }

    const db = await getDB();

    const [rows]: any = await db.execute(
      `
      SELECT 
        id,
        uuid,
        title,
        \`order\`,
        is_published
      FROM courseapp_chapter
      WHERE course_id = ?
      ORDER BY \`order\` ASC
      `,
      [courseId]
    );

    return NextResponse.json({
      success: true,
      data: rows,
    });
  } catch (e) {
    console.error("Fetch chapters error:", e);
    return NextResponse.json(
      { success: false, data: [] },
      { status: 500 }
    );
  }
}
