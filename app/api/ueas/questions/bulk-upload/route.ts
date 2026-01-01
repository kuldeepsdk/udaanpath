import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import crypto from "crypto";
import { validateInternalApi } from "@/lib/apiAuth";
import { parse } from "csv-parse/sync";
import { processBulkQuestions } from "@/lib/workers/processBulkQuestions";

/* ================= OPTIONS PARSER ================= */

function parseOptions(raw: string, rowNo: number) {
  // Format: option|1;option|0;option|0
  const parts = raw.split(";");

  if (parts.length < 2) {
    throw new Error(`Minimum 2 options required at row ${rowNo}`);
  }

  return parts.map((p) => {
    const [text, correct] = p.split("|");

    if (!text) {
      throw new Error(`Invalid option format at row ${rowNo}`);
    }

    return {
      text: text.trim(),
      is_correct: correct === "1",
    };
  });
}

/* ================= API ================= */

export async function POST(req: Request) {
  console.log("▶️ Bulk Question CSV Upload");

  /* ---------- AUTH ---------- */
  const auth = await validateInternalApi(req);
  if (!auth.ok) return auth.response;

  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) {
    return NextResponse.json(
      { success: false, error: "Missing token" },
      { status: 401 }
    );
  }

  /* ---------- FORM DATA ---------- */
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid form data" },
      { status: 400 }
    );
  }

  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json(
      { success: false, error: "CSV file required" },
      { status: 400 }
    );
  }

  /* ---------- READ CSV ---------- */
  let records: any[] = [];
  try {
    const csvText = await file.text();

    records = parse(csvText, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });
  } catch (err) {
    console.error("CSV parse error", err);
    return NextResponse.json(
      { success: false, error: "Invalid CSV format" },
      { status: 400 }
    );
  }

  if (!records.length) {
    return NextResponse.json(
      { success: false, error: "CSV is empty" },
      { status: 400 }
    );
  }

  const db = await getDB();

  /* ---------- ORG CHECK ---------- */
  const [orgRows]: any = await db.execute(
    `
    SELECT org_id
    FROM UEAS_organization_users
    WHERE session_token = ?
    LIMIT 1
    `,
    [token]
  );

  if (!orgRows.length) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const orgId = orgRows[0].org_id;

  /* ---------- VALIDATION ---------- */
  const validRows: any[] = [];
  const errors: any[] = [];

  records.forEach((r, index) => {
    const rowNo = index + 2; // header + 1

    try {
      if (!r.question_text || !r.options) {
        throw new Error("question_text and options required");
      }

      const options = parseOptions(r.options, rowNo);

      validRows.push({
        question_text: r.question_text,
        question_type: r.question_type || "mcq_single",
        difficulty: r.difficulty || "medium",
        marks: Number(r.marks || 1),
        negative_marks: Number(r.negative_marks || 0),
        subject: r.subject || null,
        topic: r.topic || null,
        analysis: r.analysis || null,
        language: r.language || "en",
        source: r.source || "custom",
        reference_link: r.reference_link || null,
        options,
      });
    } catch (err: any) {
      errors.push({
        row: rowNo,
        error: err.message,
      });
    }
  });

  if (!validRows.length) {
    return NextResponse.json(
      {
        success: false,
        error: "No valid questions found",
        errors,
      },
      { status: 400 }
    );
  }

  /* ---------- SAVE BULK PAYLOAD ---------- */
  const bulkId = crypto.randomUUID().slice(0, 16);

  await db.execute(
    `
    INSERT INTO UEAS_question_bulk_uploads
    (id, org_id, file_name, payload, total_questions, status)
    VALUES (?, ?, ?, ?, ?, 'pending')
    `,
    [
      bulkId,
      orgId,
      file.name,
      JSON.stringify(validRows),
      validRows.length,
    ]
  );

  /* ---------- BACKGROUND PROCESS ---------- */
  setImmediate(() => {
    processBulkQuestions(bulkId).catch((err) => {
      console.error("❌ Bulk question processing failed:", bulkId, err);
    });
  });

  /* ---------- RESPONSE ---------- */
  return NextResponse.json(
    {
      success: true,
      bulk_id: bulkId,
      total_rows: records.length,
      valid_rows: validRows.length,
      invalid_rows: errors.length,
      preview: validRows.slice(0, 5),
      errors,
      message: "CSV uploaded successfully. Processing started in background.",
    },
    { status: 202 }
  );
}
