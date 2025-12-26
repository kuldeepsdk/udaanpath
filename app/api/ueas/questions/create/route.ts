//app\api\ueas\questions\create\route.ts
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

  const body = await req.json();
  const {
  question_text,
  question_type,
  marks,
  negative_marks,
  difficulty,
  subject,
  topic,
  question_analysis,
  tags,
  estimated_time_sec,
  source,
  reference_link,
  language,
  is_published,
} = body;


  if (!question_text || !question_type) {
    return NextResponse.json(
      { success: false, error: "question_text and question_type required" },
      { status: 400 }
    );
  }

  if (!["mcq_single", "mcq_multi"].includes(question_type)) {
    return NextResponse.json(
      { success: false, error: "Invalid question_type" },
      { status: 400 }
    );
  }

  const db = await getDB();

  const [orgRows]: any = await db.execute(
    `SELECT org_id FROM UEAS_organization_users WHERE session_token = ? LIMIT 1`,
    [token]
  );

  if (!orgRows.length) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const questionId = crypto.randomUUID().slice(0, 16);

  await db.execute(
  `
  INSERT INTO UEAS_questions
  (id, org_id, question_text, question_type, marks, negative_marks, difficulty, subject, topic,
   question_analysis, tags, estimated_time_sec, source, reference_link, language, is_published)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `,
  [
    questionId,
    orgRows[0].org_id,
    question_text,
    question_type,
    marks ?? 1,
    negative_marks ?? 0,
    difficulty ?? "medium",
    subject ?? null,
    topic ?? null,

    question_analysis ?? null,
    tags ? JSON.stringify(tags) : null,
    estimated_time_sec ?? null,
    source ?? null,
    reference_link ?? null,
    language ?? "en",
    typeof is_published === "number" ? is_published : 1,
  ]
);


  return NextResponse.json(
    { success: true, question_id: questionId },
    { status: 201 }
  );
}
