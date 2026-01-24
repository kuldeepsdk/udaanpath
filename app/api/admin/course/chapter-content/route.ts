import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { validateAdminApi } from "@/lib/apiAuth";

/* =========================
   GET: fetch content
========================= */
export async function GET(req: Request) {
  try {
    const auth = await validateAdminApi(req);
    if (!auth.ok) return auth.response;

    const { searchParams } = new URL(req.url);
    const chapterUuid = searchParams.get("chapter_uuid");

    if (!chapterUuid) {
      return NextResponse.json(
        { success: false, data: null },
        { status: 400 }
      );
    }

    const db = await getDB();

    // 1️⃣ resolve chapter.id from uuid
    const [[chapter]]: any = await db.execute(
      `
      SELECT id
      FROM courseapp_chapter
      WHERE uuid = ?
      LIMIT 1
      `,
      [chapterUuid]
    );

    if (!chapter) {
      return NextResponse.json(
        { success: true, data: null },
        { status: 200 }
      );
    }

    // 2️⃣ fetch content using chapter_id
    const [[content]]: any = await db.execute(
      `
      SELECT content_html, video_url, notes_pdf
      FROM courseapp_chaptercontent
      WHERE chapter_id = ?
      LIMIT 1
      `,
      [chapter.id]
    );

    return NextResponse.json({
      success: true,
      data: content || null,
    });
  } catch (e) {
    console.error("Fetch chapter content error:", e);
    return NextResponse.json(
      { success: false, data: null },
      { status: 500 }
    );
  }
}


/* =========================
   POST: upsert content
========================= */
export async function POST(req: Request) {
  try {
    const auth = await validateAdminApi(req);
    if (!auth.ok) return auth.response;

    const {
  chapter_uuid,
  content_html,
  video_url,
  notes_pdf,
} = await req.json();

    if (!chapter_uuid || !content_html) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const db = await getDB();

    const [[chapter]]: any = await db.execute(
      `SELECT id FROM courseapp_chapter WHERE uuid = ? LIMIT 1`,
      [chapter_uuid]
    );

    if (!chapter) {
      return NextResponse.json(
        { success: false, error: "Chapter not found" },
        { status: 404 }
      );
    }
await db.execute(
  `
  INSERT INTO courseapp_chaptercontent
    (chapter_id, content_html, video_url, notes_pdf)
  VALUES (?, ?, ?, ?)
  ON DUPLICATE KEY UPDATE
    content_html = VALUES(content_html),
    video_url = VALUES(video_url),
    notes_pdf = VALUES(notes_pdf)
  `,
  [
    chapter.id,
    content_html,
    video_url || null,
    notes_pdf || null,
  ]
);

    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error("Save chapter content failed:", e);
    return NextResponse.json(
      { success: false, error: e.message },
      { status: 500 }
    );
  }
}


