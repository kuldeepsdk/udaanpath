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
  const paper_id = searchParams.get("paper_id");

  if (!paper_id) {
    return NextResponse.json(
      { success: false, error: "paper_id required" },
      { status: 400 }
    );
  }

  const db = await getDB();

  const [paperRows]: any = await db.execute(
    `
    SELECT p.*
    FROM UEAS_papers p
    JOIN UEAS_organization_users u ON u.org_id = p.org_id
    WHERE p.id = ? AND u.session_token = ?
    LIMIT 1
    `,
    [paper_id, token]
  );

  if (!paperRows.length) {
    return NextResponse.json(
      { success: false, error: "Paper not found" },
      { status: 404 }
    );
  }

  const [questions]: any = await db.execute(
    `
    SELECT q.id, q.question_text, q.question_type, q.marks, pq.question_order
    FROM UEAS_paper_questions pq
    JOIN UEAS_questions q ON q.id = pq.question_id
    WHERE pq.paper_id = ?
    ORDER BY pq.question_order
    `,
    [paper_id]
  );

  for (const q of questions) {
    const [opts]: any = await db.execute(
      `
      SELECT id, option_text, option_order
      FROM UEAS_question_options
      WHERE question_id = ?
      ORDER BY option_order
      `,
      [q.id]
    );
    q.options = opts;
  }

  return NextResponse.json(
    {
      success: true,
      paper: paperRows[0],
      questions,
    },
    { status: 200 }
  );
}
