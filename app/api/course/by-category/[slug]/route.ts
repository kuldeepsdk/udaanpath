import { NextResponse } from "next/server";
import {getDB} from "@/lib/db";
import { validateInternalApi } from "@/lib/apiAuth";
import { getCache,setCache } from "@/lib/cache";

const CACHE_TIL = 60 * 60 * 1000; // 60 minutes in milliseconds

export async function GET(req: Request,context:{params:Promise<{slug:string}>}){
    const base = await validateInternalApi(req);
    if(!base.ok) return base.response;

    const {slug} = await context.params;

    console.log("Fetching courses for category slug:", slug);
    const db = getDB();

    const cacheKey = `course:by-category:${slug}`;
    const cached = await getCache<any>(cacheKey);
    if(cached) return NextResponse.json(cached);

    const [[category]]: any = await db.execute(`
        SELECT id,name,slug,thumbnail_base64 from courseapp_studycategory WHERE slug = ? AND is_published = 1 LIMIT 1
        `,[slug]);

    if(!category) {
        return NextResponse.json({success:false,error:"Category not found "},{status:404});
    }

    const [courses]: any = await db.execute(`
        SELECT c.id,c.title,c.slug,c.description,c.thumbnail_base64 FROM courseapp_course c
        JOIN courseapp_course_categories cc ON cc.course_id = c.id
        WHERE cc.studycategory_id = ? AND c.is_published = 1
        ORDER BY c.title ASC        
        `,[category.id]);
    return NextResponse.json({success:true, category, courses});

}