import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { getCache, setCache } from "@/lib/cache";
import { validateInternalApi } from "@/lib/apiAuth";

const PAGE_SIZE = 12;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function GET(req: Request) {
  try {
    /* -------------------------
       Internal token check
    -------------------------- */
    const auth = await validateInternalApi(req);
    if (!auth.ok) return auth.response;
   

    const { searchParams } = new URL(req.url);

    const page = Math.max(Number(searchParams.get("page") || 1), 1);
    const limit = Math.min(
      Number(searchParams.get("limit") || PAGE_SIZE),
      50
    );
    const offset = (page - 1) * limit;

    const q = (searchParams.get("q") || "").trim();
    const category = (searchParams.get("category") || "").trim();

    /* -------------------------
       Cache key
    -------------------------- */
    const cacheKey = `jobs:page:${page}:limit:${limit}:q:${q}:cat:${category}`;
    const cached = getCache<any>(cacheKey);
    if (cached) {
      return NextResponse.json(cached, {
        headers: { "X-Cache": "HIT" },
      });
    }

    const db = await getDB();

    /* -------------------------
       WHERE clause
    -------------------------- */
    const where: string[] = ["published = 1"];
    const params: any[] = [];

    if (category) {
      where.push("category = ?");
      params.push(category);
    }

    if (q) {
      where.push("(title LIKE ? OR organization LIKE ?)");
      params.push(`%${q}%`, `%${q}%`);
    }

    const whereSQL = where.length
      ? `WHERE ${where.join(" AND ")}`
      : "";

    /* -------------------------
       Count
    -------------------------- */
    const [[countRow]]: any = await db.execute(
      `SELECT COUNT(*) AS total FROM job_posts ${whereSQL}`,
      params
    );

    const total = Number(countRow?.total || 0);
    const totalPages = Math.max(Math.ceil(total / limit), 1);

    /* -------------------------
       Data
    -------------------------- */
    const [rows]: any = await db.execute(
  `
  SELECT
    id,
    title,
    slug,
    category,
    organization,
    department,
    summary,
    total_posts,
    created_at,

    -- image flag
    CASE
      WHEN notification_image_base64 IS NULL
        OR notification_image_base64 = ''
      THEN 0
      ELSE 1
    END AS has_image,

    -- actual image
    notification_image_base64 AS image_base64

  FROM job_posts
  ${whereSQL}
  ORDER BY created_at DESC
  LIMIT ${offset}, ${limit}
  `,
  params
);


    const response = {
      success: true,
      data: rows,
      meta: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };

    /* -------------------------
       Cache store
    -------------------------- */
    setCache(cacheKey, response, CACHE_TTL);

    return NextResponse.json(response, {
      headers: { "X-Cache": "MISS" },
    });
  } catch (error) {
    console.error("Public Jobs API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}
