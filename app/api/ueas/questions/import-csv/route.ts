import { NextResponse } from "next/server";
import { validateInternalApi } from "@/lib/apiAuth";
import { getDB } from "@/lib/db";
import crypto from "crypto";

export async function POST(req: Request) {
  console.log("▶️ CSV Import (Partial) API called");

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

  /* ---------------- BODY ---------------- */
  const { upload_id } = await req.json();
  if (!upload_id) {
    return NextResponse.json(
      { success: false, error: "upload_id required" },
      { status: 400 }
    );
  }

  const db = await getDB();

  /* ---------------- ORG ---------------- */
  const [orgRows]: any = await db.execute(
    `SELECT org_id FROM UEAS_organization_users WHERE session_token = ? LIMIT 1`,
    [token]
  );

  if (!orgRows.length) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const org_id = orgRows[0].org_id;

  /* ---------------- LOAD CSV PAYLOAD ---------------- */
  const [uploadRows]: any = await db.execute(
    `SELECT payload, org_id FROM UEAS_question_csv_uploads WHERE id = ? LIMIT 1`,
    [upload_id]
  );

  if (!uploadRows.length) {
    return NextResponse.json(
      { success: false, error: "upload_id not found" },
      { status: 404 }
    );
  }

  if (uploadRows[0].org_id !== org_id) {
    return NextResponse.json(
      { success: false, error: "Upload does not belong to your org" },
      { status: 403 }
    );
  }

  let rows: any[] = [];

const payload = uploadRows[0].payload;

if (Array.isArray(payload)) {
  // MySQL JSON column auto-parsed
  rows = payload;
} else if (typeof payload === "string") {
  // Stored as string
  rows = JSON.parse(payload || "[]");
} else {
  // Fallback safety
  rows = [];
}


  const created_questions: string[] = [];
  const errors: any[] = [];

  /* ---------------- PARTIAL INSERT ---------------- */
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];

    try {
      /* ---------- BASIC VALIDATION ---------- */
      if (!row.question_text || !row.question_type) {
        throw new Error("Missing question_text or question_type");
      }

      const options = [
        { text: row.option_1, correct: row.option_1_correct },
        { text: row.option_2, correct: row.option_2_correct },
        { text: row.option_3, correct: row.option_3_correct },
        { text: row.option_4, correct: row.option_4_correct },
      ].filter((o) => o.text && String(o.text).trim());

      if (options.length < 2) {
        throw new Error("At least 2 options required");
      }

      const correctCount = options.filter(o => String(o.correct) === "1").length;
      if (
        row.question_type === "mcq_single" && correctCount !== 1
      ) {
        throw new Error("Single MCQ must have exactly one correct option");
      }

      /* ---------- INSERT QUESTION ---------- */
      const questionId = crypto.randomUUID().slice(0, 16);

      await db.execute(
        `
        INSERT INTO UEAS_questions
        (id, org_id, question_text, question_type, marks, negative_marks,
         difficulty, subject, topic, question_analysis, tags,
         estimated_time_sec, source, reference_link, language, is_published)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          questionId,
          org_id,
          row.question_text,
          row.question_type,
          Number(row.marks ?? 1),
          Number(row.negative_marks ?? 0),
          row.difficulty ?? "medium",
          row.subject ?? null,
          row.topic ?? null,
          row.question_analysis ?? null,
          row.tags ? JSON.stringify(row.tags) : null,
          row.estimated_time_sec ?? null,
          row.source ?? "custom",
          row.reference_link ?? null,
          row.language ?? "en",
          row.is_published === 0 ? 0 : 1,
        ]
      );

      /* ---------- INSERT OPTIONS ---------- */
      for (let j = 0; j < options.length; j++) {
        await db.execute(
          `
          INSERT INTO UEAS_question_options
          (id, question_id, option_text, is_correct, option_order)
          VALUES (?, ?, ?, ?, ?)
          `,
          [
            crypto.randomUUID().slice(0, 16),
            questionId,
            String(options[j].text),
            String(options[j].correct) === "1" ? 1 : 0,
            j + 1,
          ]
        );
      }

      created_questions.push(questionId);
    } catch (e: any) {
      errors.push({
        row: i + 1,
        question_text: row.question_text || "",
        error: e.message,
      });
    }
  }

  /* ---------------- CLEANUP ---------------- */
  if (created_questions.length > 0) {
    await db.execute(
      `DELETE FROM UEAS_question_csv_uploads WHERE id = ?`,
      [upload_id]
    );
  }

  let finalStatus = "imported";

  if (errors.length > 0 && created_questions.length > 0) {
    finalStatus = "partial";
  } else if (created_questions.length === 0) {
    finalStatus = "pending";
  }

  await db.execute(`
    UPDATE UEAS_question_csv_uploads
    SET status = ?, 
        total_rows = ?, 
        imported_rows = ?, 
        failed_rows = ?
    WHERE id = ?
  `, [
    finalStatus,
    rows.length,
    created_questions.length,
    errors.length,
    upload_id
  ]);


  return NextResponse.json(
    {
      success: true,
      upload_id,
      total_rows: rows.length,
      inserted: created_questions.length,
      failed: errors.length,
      errors,
    },
    { status: 200 }
  );
}
