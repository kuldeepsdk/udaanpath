import { getDB } from "@/lib/db";
import { NextResponse } from "next/server";
import { getCache, setCache } from "@/lib/cache";
import { validateInternalApi } from "@/lib/apiAuth";

const CACHE_KEY = "udaanpath:ads:active";
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function GET(req: Request) {
  try {
    const auth = await validateInternalApi(req);
    if (!auth.ok) return auth.response;


    /* ===============================
       1️⃣ Try cache first
    =============================== */
    const cachedAds = getCache<any[]>(CACHE_KEY);
    if (cachedAds) {
      return NextResponse.json(cachedAds, {
        status: 200,
        headers: {
          "Cache-Control": "no-store",
          "X-Cache": "HIT",
        },
      });
    }

    /* ===============================
       2️⃣ Fetch from DB (only on miss)
    =============================== */
    const db = await getDB();
    const [rows] = await db.execute(
      `
      SELECT 
        id, 
        title, 
        description, 
        image_base64, 
        is_active, 
        created_on 
      FROM udaanpath_customad 
      WHERE is_active = 1 
      ORDER BY id DESC
      `
    );

    /* ===============================
       3️⃣ Save to cache
    =============================== */
    setCache(CACHE_KEY, rows, CACHE_TTL);

    return NextResponse.json(rows, {
      status: 200,
      headers: {
        "Cache-Control": "no-store",
        "X-Cache": "MISS",
      },
    });

  } catch (error) {
    console.error("Ads API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch ads." },
      { status: 500 }
    );
  }
}
