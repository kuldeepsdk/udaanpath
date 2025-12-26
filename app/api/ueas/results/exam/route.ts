import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { validateInternalApi } from "@/lib/apiAuth";

export async function GET(req: Request) {
  const auth = await validateInternalApi(req);
  if (!auth.ok) return auth.response;

  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) {
    return NextResponse.json({ success: false, error: "Missing token" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const exam_id = searchParams.get("exam_id");
  if (!exam_id) {
    return NextResponse.json({ success: false, error: "exam_id required" }, { status: 400 });
  }

  const db = await getDB();

  // Ownership check
  const [examRows]: any = await db.execute(
    `
    SELECT e.id
    FROM UEAS_exams e
    JOIN UEAS_organization_users u ON u.org_id = e.org_id
    WHERE e.id = ? AND u.session_token = ?
    LIMIT 1
    `,
    [exam_id, token]
  );
  if (!examRows.length) {
    return NextResponse.json({ success: false, error: "Exam not found" }, { status: 404 });
  }

  const [rows]: any = await db.execute(
    `
    SELECT 
      r.student_id,
      s.roll_no,
      s.name,
      r.total_marks,
      r.obtained_marks,
      r.percentage,
      r.rank_position
    FROM UEAS_exam_results r
    JOIN UEAS_students s ON s.id = r.student_id
    WHERE r.exam_id = ?
    ORDER BY r.rank_position ASC, r.obtained_marks DESC
    `,
    [exam_id]
  );

  return NextResponse.json({ success: true, results: rows }, { status: 200 });
}
