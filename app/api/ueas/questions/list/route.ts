import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { validateInternalApi } from "@/lib/apiAuth";

export async function GET(req: Request) {
  console.log("▶️ Question List API called");

  /* ---------------- AUTH ---------------- */
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
  const limit = Math.min(100, Number(searchParams.get("limit")) || 20);
  const offset = (page - 1) * limit;

  /* ---------------- FILTERS ---------------- */
  const search = searchParams.get("search")?.trim();
  const subject = searchParams.get("subject")?.trim();
  const difficulty = searchParams.get("difficulty");
  const status = searchParams.get("status"); // published | draft

  /* ---------------- WHERE CLAUSE ---------------- */
  let whereSql = `
    FROM UEAS_questions q
    JOIN UEAS_organization_users u
      ON u.org_id = q.org_id
    WHERE u.session_token = ?
  `;

  const params: any[] = [token];

  if (search) {
    whereSql += `
      AND (
        q.question_text LIKE ?
        OR q.subject LIKE ?
        OR q.topic LIKE ?
      )
    `;
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  if (subject) {
    whereSql += " AND q.subject = ?";
    params.push(subject);
  }

  if (difficulty && ["easy", "medium", "hard"].includes(difficulty)) {
    whereSql += " AND q.difficulty = ?";
    params.push(difficulty);
  }

  if (status === "published") {
    whereSql += " AND q.is_published = 1";
  } else if (status === "draft") {
    whereSql += " AND q.is_published = 0";
  }

  /* ---------------- SQL QUERIES ---------------- */

  const countSql = `
    SELECT COUNT(*) as total
    ${whereSql}
  `;

  const dataSql = `
    SELECT
      q.id,
      q.question_text,
      q.question_type,
      q.marks,
      q.negative_marks,
      q.difficulty,
      q.subject,
      q.topic,
      q.language,
      q.is_published,
      q.estimated_time_sec,
      q.source,
      q.created_at
    ${whereSql}
    ORDER BY q.created_at DESC
    LIMIT ${offset}, ${limit}
  `;

  /* ---------------- DEBUG ---------------- */
  console.log("▶️ COUNT SQL:\n", countSql);
  console.log("▶️ DATA SQL:\n", dataSql);
  console.log("▶️ PARAMS:", params);

  try {
    const db = await getDB();

    const [[countRow]]: any = await db.query(countSql, params);
    const total = countRow.total;

    const [rows]: any = await db.query(dataSql, params);

    return NextResponse.json(
      {
        success: true,
        page,
        limit,
        total,          // ✅ REQUIRED FOR PAGINATION
        questions: rows,
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("❌ Question list query failed", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch questions" },
      { status: 500 }
    );
  }
}
