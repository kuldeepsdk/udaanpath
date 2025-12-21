import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { getCache, setCache } from "@/lib/cache";
import { validateInternalApi } from "@/lib/apiAuth";

const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

export async function GET(
  req: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    // 🔐 Token check
    const auth = await validateInternalApi(req);
    if (!auth.ok) return auth.response;
    

    // ✅ FIX: await params
    const { slug } = await context.params;

    if (!slug) {
      return NextResponse.json(
        { error: "Slug missing" },
        { status: 400 }
      );
    }

    

    // 🔁 Cache
    const cacheKey = `blog:detail:${slug}`;
    const cached = getCache<any>(cacheKey);
    if (cached) {
      return NextResponse.json(cached, {
        status: 200,
        headers: { "X-Cache": "HIT" },
      });
    }

    // 🗄️ DB
    const db = await getDB();
    const [rows]: any = await db.execute(
      `
      SELECT 
        id,
        title,
        slug,
        summary,
        content,
        image_base64,
        created_at
      FROM blogapp_post
      WHERE slug = ? AND published = 1
      LIMIT 1
      `,
      [slug]
    );

    if (!rows || rows.length === 0) {
      return NextResponse.json(
        { error: "Blog not found" },
        { status: 404 }
      );
    }

    setCache(cacheKey, rows[0], CACHE_TTL);

    return NextResponse.json(rows[0], {
      status: 200,
      headers: { "X-Cache": "MISS" },
    });

  } catch (error) {
    console.error("Blog detail API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog " },

      { status: 500 }
    );
  }
}
