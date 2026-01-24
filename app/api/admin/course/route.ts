import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";

const PAGE_SIZE = 10;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const page = Math.max(
      parseInt(searchParams.get("page") || "1"),
      1
    );
    const q = (searchParams.get("q") || "").trim();

    const offset = (page - 1) * PAGE_SIZE;

    const db = await getDB();

    /* -------------------------------
       WHERE condition (search)
    -------------------------------- */
    let whereSql = "";
    let params: any[] = [];

    if (q) {
      whereSql = `WHERE title LIKE ? OR slug LIKE ?`;
      params.push(`%${q}%`, `%${q}%`);
    }

    /* -------------------------------
       Total count
    -------------------------------- */
    const [countRows]: any = await db.execute(
      `
      SELECT COUNT(*) as total
      FROM courseapp_course
      ${whereSql}
      `,
      params
    );

    const total = countRows[0]?.total || 0;

    /* -------------------------------
       Paginated data
    -------------------------------- */
    const [rows]: any = await db.execute(
      `
      SELECT id, title, slug, is_published
      FROM courseapp_course
      ${whereSql}
      ORDER BY id DESC
      LIMIT ${PAGE_SIZE} OFFSET ${offset}
      `,
      params
    );

    return NextResponse.json({
      success: true,
      data: rows,
      pagination: {
        page,
        pageSize: PAGE_SIZE,
        total,
        totalPages: Math.ceil(total / PAGE_SIZE),
      },
    });
  } catch (error) {
    console.error("Admin course list error:", error);
    return NextResponse.json(
      { success: false, data: [], pagination: null },
      { status: 500 }
    );
  }
}


/* --------------------------------
   POST: Create Course
--------------------------------- */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, slug, description, is_published } = body;

    if (!title || !slug) {
      return NextResponse.json(
        { success: false, message: "Invalid data" },
        { status: 400 }
      );
    }

    const db = await getDB();

    await db.execute(
      `
      INSERT INTO courseapp_course
        (title, slug, description, is_published)
      VALUES (?, ?, ?, ?)
      `,
      [title, slug, description, is_published ? 1 : 0]
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Create course error:", error);

    // duplicate slug protection
    if (error?.code === "ER_DUP_ENTRY") {
      return NextResponse.json(
        { success: false, message: "Course already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false },
      { status: 500 }
    );
  }
}
