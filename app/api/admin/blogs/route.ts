import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { validateAdminApi } from "@/lib/apiAuth";

export async function GET(req: Request) {
  const auth = await validateAdminApi(req);
  if (!auth.ok) return auth.response;

  const url = new URL(req.url);

  const page = Math.max(parseInt(url.searchParams.get("page") || "1", 10), 1);
  const rawLimit = parseInt(url.searchParams.get("limit") || "10", 10);

  // 🔒 HARD LIMITS (security)
  const limit = Math.min(Math.max(rawLimit, 1), 50);
  const offset = (page - 1) * limit;

  const q = (url.searchParams.get("q") || "").trim();
  const publishedParam = url.searchParams.get("published");

  const whereParts: string[] = [];
  const params: any[] = [];

  if (publishedParam === "0" || publishedParam === "1") {
    whereParts.push("published = ?");
    params.push(Number(publishedParam));
  }

  if (q) {
    whereParts.push("(title LIKE ? OR slug LIKE ?)");
    params.push(`%${q}%`, `%${q}%`);
  }

  const whereSQL = whereParts.length ? `WHERE ${whereParts.join(" AND ")}` : "";

  const db = await getDB();

  // ✅ Count (safe prepared)
  const [countRows]: any = await db.execute(
    `SELECT COUNT(*) as total FROM blogapp_post ${whereSQL}`,
    params
  );

  const total = Number(countRows?.[0]?.total || 0);
  const totalPages = Math.max(Math.ceil(total / limit), 1);

  // ✅ LIMIT/OFFSET injected safely AFTER validation
  const sql = `
    SELECT id, title, slug, summary, created_at, published
    FROM blogapp_post
    ${whereSQL}
    ORDER BY created_at DESC
    LIMIT ${offset}, ${limit}
  `;

  const [rows]: any = await db.execute(sql, params);

  return NextResponse.json({
    success: true,
    admin: auth.admin,
    meta: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
    data: rows,
  });
}
