// app\api\ueas\papers\add-questions\route.ts

import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import crypto from "crypto";
import { validateInternalApi } from "@/lib/apiAuth";

export async function POST(req: Request) {
  const auth = await validateInternalApi(req);
  if (!auth.ok) return auth.response;

  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) {
    return NextResponse.json({ success: false, error: "Missing token" }, { status: 401 });
  }

  const { paper_id, question_ids } = await req.json();

  if (!paper_id || !Array.isArray(question_ids) || question_ids.length === 0) {
    return NextResponse.json(
      { success: false, error: "paper_id and question_ids[] required" },
      { status: 400 }
    );
  }

  const db = await getDB();

  let order = 1;
  for (const qid of question_ids) {
    await db.execute(
      `
      INSERT IGNORE INTO UEAS_paper_questions
      (id, paper_id, question_id, question_order)
      VALUES (?, ?, ?, ?)
      `,
      [crypto.randomUUID().slice(0, 16), paper_id, qid, order++]
    );
  }

  // 🔄 Update counts
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
    { success: true, message: "Questions added to paper" },
    { status: 200 }
  );
}
