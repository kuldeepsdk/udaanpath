import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { getCache, setCache } from "@/lib/cache";
import { RowDataPacket } from "mysql2";
import { validateInternalApi } from "@/lib/apiAuth";

const PAGE_SIZE = 10;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function GET(req: Request) {
  try {
    const auth = await validateInternalApi(req);
    if (!auth.ok) return auth.response;
    

    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page") || 1);
    const limit = 9;
    const offset = (page - 1) * PAGE_SIZE;

    const cacheKey = `blogs:page:${page}`;
    const cached = getCache<any>(cacheKey);
    if (cached) {
      return NextResponse.json(cached, {
        status: 200,
        headers: { "X-Cache": "HIT" },
      });
    }

    const db = await getDB();

    /* 🔹 total count (UNCHANGED TABLE) */
    const [[{ total }]]: any = await db.execute(
      "SELECT COUNT(*) AS total FROM blogapp_post WHERE published = 1"
    );

    /* 🔹 paginated blogs (UNCHANGED TABLE + KEYS) */
    const [rows] = await db.query<RowDataPacket[]>(
      "SELECT id,title,slug,summary,image_base64,created_at FROM blogapp_post WHERE published = 1 ORDER BY created_at DESC LIMIT ? OFFSET ?",
      [limit, offset]
    );

    const response = {
      blogs: rows,
      page,
      totalPages: Math.ceil(total / PAGE_SIZE),
    };

    setCache(cacheKey, response, CACHE_TTL);

    return NextResponse.json(response, {
      status: 200,
      headers: { "X-Cache": "MISS" },
    });

  } catch (error) {
    console.error("Blogs API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}
