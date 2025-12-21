import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { getCache, setCache } from "@/lib/cache";

const CACHE_TTL = 5 * 60 * 1000;

export async function GET(
  req: Request,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;

  const cacheKey = `job:${slug}`;
  const cached = getCache(cacheKey);
  if (cached) {
    return NextResponse.json(cached);
  }

  const db = await getDB();

  const [[job]]: any = await db.execute(
    `SELECT * FROM job_posts WHERE slug = ? AND published = 1 LIMIT 1`,
    [slug]
  );

  if (!job) {
    return NextResponse.json(
      { success: false, error: "Job not found" },
      { status: 404 }
    );
  }

  const [dates]: any = await db.execute(
    `SELECT * FROM job_important_dates WHERE job_id = ? ORDER BY event_date`,
    [job.id]
  );

  const [links]: any = await db.execute(
    `SELECT * FROM job_links WHERE job_id = ?`,
    [job.id]
  );

  const [vacancy]: any = await db.execute(
    `SELECT * FROM job_vacancy_breakup WHERE job_id = ?`,
    [job.id]
  );

  const response = { job, dates, links, vacancy };
  setCache(cacheKey, response, CACHE_TTL);

  return NextResponse.json(response);
}
