//app\api\ueas\questions\detail\route.ts

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
  const question_id = searchParams.get("question_id");

  if (!question_id) {
    return NextResponse.json(
      { success: false, error: "question_id required" },
      { status: 400 }
    );
  }

  const db = await getDB();

  const [qRows]: any = await db.execute(
    `
    SELECT q.*
    FROM UEAS_questions q
    JOIN UEAS_organization_users u ON u.org_id = q.org_id
    WHERE q.id = ? AND u.session_token = ?
    LIMIT 1
    `,
    [question_id, token]
  );

  if (!qRows.length) {
    return NextResponse.json(
      { success: false, error: "Question not found" },
      { status: 404 }
    );
  }

  const [optRows]: any = await db.execute(
    `
    SELECT id, option_text, is_correct, option_order
    FROM UEAS_question_options
    WHERE question_id = ?
    ORDER BY option_order
    `,
    [question_id]
  );

  return NextResponse.json(
    {
      success: true,
      question: qRows[0],
      options: optRows,
    },
    { status: 200 }
  );
}
