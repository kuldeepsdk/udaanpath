import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { validateInternalApi } from "@/lib/apiAuth";

export async function GET(req: Request) {
  const auth = await validateInternalApi(req);
  if (!auth.ok) return auth.response;

  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) {
    return NextResponse.json(
      { success: false, error: "Missing token" },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(req.url);

  /* ---------------- PAGINATION ---------------- */
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const limit = Math.min(50, Number(searchParams.get("limit")) || 10);
  const offset = (page - 1) * limit;

  /* ---------------- FILTERS ---------------- */
  const search = searchParams.get("search")?.trim();
  const is_active = searchParams.get("is_active"); // "0" | "1"

  const db = await getDB();

  /* ---------------- BASE QUERY ---------------- */
  let sql = `
    SELECT
      p.id,
      p.name,
      p.total_questions,
      p.total_marks,
      p.default_duration_minutes,
      p.is_active,
      p.created_at
    FROM UEAS_papers p
    JOIN UEAS_organization_users u ON u.org_id = p.org_id
    WHERE u.session_token = ?
  `;

  const params: any[] = [token];

  /* ---------------- SEARCH BY NAME ---------------- */
  if (search) {
    sql += ` AND p.name LIKE ?`;
    params.push(`%${search}%`);
  }

  /* ---------------- STATUS FILTER ---------------- */
  if (is_active === "0" || is_active === "1") {
    sql += ` AND p.is_active = ?`;
    params.push(Number(is_active));
  }

  /* ---------------- ORDER + PAGINATION ---------------- */
  sql += `
    ORDER BY p.created_at DESC
    LIMIT ${offset}, ${limit}
  `;

  console.log("▶️ PAPER LIST SQL:\n", sql);
  console.log("▶️ PARAMS:", params);

  const [rows]: any = await db.query(sql, params);

  /* ---------------- TOTAL COUNT (FOR PAGINATION) ---------------- */
  let countSql = `
    SELECT COUNT(*) as total
    FROM UEAS_papers p
    JOIN UEAS_organization_users u ON u.org_id = p.org_id
    WHERE u.session_token = ?
  `;

  const countParams: any[] = [token];

  if (search) {
    countSql += ` AND p.name LIKE ?`;
    countParams.push(`%${search}%`);
  }

  if (is_active === "0" || is_active === "1") {
    countSql += ` AND p.is_active = ?`;
    countParams.push(Number(is_active));
  }

  const [countRows]: any = await db.query(countSql, countParams);

  return NextResponse.json(
    {
      success: true,
      page,
      limit,
      count: countRows[0].total,
      papers: rows,
    },
    { status: 200 }
  );
}
