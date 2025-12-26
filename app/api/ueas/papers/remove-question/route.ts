import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { validateInternalApi } from "@/lib/apiAuth";

export async function POST(req: Request) {
  const auth = await validateInternalApi(req);
  if (!auth.ok) return auth.response;

  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) {
    return NextResponse.json({ success: false, error: "Missing token" }, { status: 401 });
  }

  const { paper_id, question_id } = await req.json();

  if (!paper_id || !question_id) {
    return NextResponse.json(
      { success: false, error: "paper_id and question_id required" },
      { status: 400 }
    );
  }

  const db = await getDB();

  await db.execute(
    `
    DELETE FROM UEAS_paper_questions
    WHERE paper_id = ? AND question_id = ?
    `,
    [paper_id, question_id]
  );

  // 🔄 Recalculate totals
  await db.execute(
    `
    UPDATE UEAS_papers
    SET 
      total_questions = (
        SELECT COUNT(*) FROM UEAS_paper_questions WHERE paper_id = ?
      ),
      total_marks = (
        SELECT IFNULL(SUM(q.marks),0)
        FROM UEAS_paper_questions pq
        JOIN UEAS_questions q ON q.id = pq.question_id
        WHERE pq.paper_id = ?
      )
    WHERE id = ?
    `,
    [paper_id, paper_id, paper_id]
  );

  return NextResponse.json(
    { success: true, message: "Question removed from paper" },
    { status: 200 }
  );
}
