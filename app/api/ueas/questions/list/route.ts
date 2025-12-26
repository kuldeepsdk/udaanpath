import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { validateInternalApi } from "@/lib/apiAuth";

export async function GET(req: Request) {
  console.log("▶️ Question List API called");

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
  const search = searchParams.get("search");
  const subject = searchParams.get("subject");
  const difficulty = searchParams.get("difficulty");
  const status = searchParams.get("status"); // published | draft

  /* ---------------- BASE QUERY ---------------- */
  let sql = `
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
    FROM UEAS_questions q
    JOIN UEAS_organization_users u
      ON u.org_id = q.org_id
    WHERE u.session_token = ?
  `;

  const params: any[] = [token];

  /* ---------------- SEARCH ---------------- */
  if (search && search.trim()) {
    sql += `
      AND (
        q.question_text LIKE ?
        OR q.subject LIKE ?
        OR q.topic LIKE ?
      )
    `;
    params.push(
      `%${search}%`,
      `%${search}%`,
      `%${search}%`
    );
  }

  /* ---------------- SUBJECT ---------------- */
  if (subject && subject.trim()) {
    sql += " AND q.subject = ?";
    params.push(subject);
  }

  /* ---------------- DIFFICULTY ---------------- */
  if (difficulty && ["easy", "medium", "hard"].includes(difficulty)) {
    sql += " AND q.difficulty = ?";
    params.push(difficulty);
  }

  /* ---------------- STATUS ---------------- */
  if (status === "published") {
    sql += " AND q.is_published = 1";
  } else if (status === "draft") {
    sql += " AND q.is_published = 0";
  }

  /* ---------------- ORDER + LIMIT ---------------- */
  sql += `
    ORDER BY q.created_at DESC
    LIMIT ${offset}, ${limit}
  `;

  /* ---------------- DEBUG LOGS ---------------- */
  console.log("▶️ FINAL SQL:\n", sql);
  console.log("▶️ PARAMS:", params);

  try {
    const db = await getDB();
    const [rows]: any = await db.query(sql, params);

    return NextResponse.json(
      {
        success: true,
        page,
        limit,
        count: rows.length,
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
