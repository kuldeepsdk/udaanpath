import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { validateInternalApi } from "@/lib/apiAuth";
import { getCache, setCache } from "@/lib/cache";

const CACHE_TTL = 60 * 60 * 1000; // 1 hour

export async function GET(
  req: Request,
  context: { params: Promise<{ slug: string }> }
) {
  // 🔐 Internal validation
  const base = await validateInternalApi(req);
  if (!base.ok) return base.response;

  const { slug } = await context.params;
  const url = new URL(req.url);
  const chapterUUID = url.searchParams.get("chapter") || "first";

  // 🔑 Cache key (course + chapter)
  const cacheKey = `courses:detail:${slug}:${chapterUUID}`;

  const cached = getCache<any>(cacheKey);
  if (cached) {
    return NextResponse.json(cached, {
      headers: { "X-Cache": "HIT" },
    });
  }

  const db = await getDB();

  /* -----------------------------
     Fetch course
  ------------------------------ */
  const [[course]]: any = await db.execute(
    `
    SELECT id, title, slug, description, thumbnail_base64
    FROM courseapp_course
    WHERE slug = ? AND is_published = 1
    LIMIT 1
    `,
    [slug]
  );

  if (!course) {
    return NextResponse.json(
      { success: false, error: "Course not found" },
      { status: 404 }
    );
  }

  /* -----------------------------
     Fetch chapters
  ------------------------------ */
  const [chapters]: any = await db.execute(
    `
    SELECT id, uuid, title, \`order\`
    FROM courseapp_chapter
    WHERE course_id = ? AND is_published = 1
    ORDER BY \`order\` ASC
    `,
    [course.id]
  );

  let currentChapter = chapters[0] || null;

  if (chapterUUID !== "first") {
    const match = chapters.find((c: any) => c.uuid === chapterUUID);
    if (match) currentChapter = match;
  }

  /* -----------------------------
     Fetch chapter content
  ------------------------------ */
  let chapterContent = null;
  if (currentChapter) {
    const [[content]]: any = await db.execute(
      `
      SELECT content_html, video_url, notes_pdf
      FROM courseapp_chaptercontent
      WHERE chapter_id = ?
      LIMIT 1
      `,
      [currentChapter.id]
    );
    chapterContent = content || null;
  }

  const response = {
    success: true,
    course,
    chapters,
    currentChapter,
    chapterContent,
  };

  // 💾 Store in cache
  setCache(cacheKey, response, CACHE_TTL);

  return NextResponse.json(response, {
    headers: { "X-Cache": "MISS" },
  });
}
