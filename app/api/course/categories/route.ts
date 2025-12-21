import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { validateInternalApi } from "@/lib/apiAuth";
import { getCache,setCache } from "@/lib/cache";

const CACHE_TIL = 60 * 60 * 1000; // 60 minutes in milliseconds

export async function GET(req: Request){
    const base = await validateInternalApi(req);
    if(!base.ok) return base.response;
    const cacheKey = "course:categories";
    const cached = await getCache<any>(cacheKey);
    if(cached) return NextResponse.json(cached);

    const db = getDB();

    const [row]: any = await db.execute(`
        SELECT id, name, slug, thumbnail_base64 from courseapp_studycategory WHERE is_published = 1 ORDER BY name ASC
        `);

    const response = {success:true, data:row};
    setCache(cacheKey,response,CACHE_TIL);
    return NextResponse.json(response);
}