import { NextResponse } from "next/server";
import { validateInternalApi } from "@/lib/apiAuth";
import { getDB } from "@/lib/db";
import { parse } from "csv-parse/sync";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  console.log("▶️ CSV Upload API called");

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

  /* ---------------- READ FILE ---------------- */
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json(
      { success: false, error: "CSV file required" },
      { status: 400 }
    );
  }

  const csvText = await file.text();

  /* ---------------- PARSE CSV ---------------- */
  let records: any[] = [];
  try {
    records = parse(csvText, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });
  } catch (e: any) {
    return NextResponse.json(
      { success: false, error: "Invalid CSV format" },
      { status: 400 }
    );
  }

  /* ---------------- VALIDATION ---------------- */
  const validRows: any[] = [];
  const errors: any[] = [];

  records.forEach((row, index) => {
    const rowNum = index + 2; // header = row 1

    try {
      validateRow(row);
      validRows.push(row);
    } catch (err: any) {
      errors.push({
        row: rowNum,
        error: err.message,
      });
    }
  });

  /* ---------------- GET ORG ---------------- */
  const db = await getDB();
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

  /* ---------------- STORE TEMP ---------------- */
  const uploadId = uuidv4();

  await db.execute(
    `
    INSERT INTO UEAS_question_csv_uploads (id, org_id, payload)
    VALUES (?, ?, ?)
    `,
    [
      uploadId,
      orgRows[0].org_id,
      JSON.stringify(validRows),
    ]
  );

  /* ---------------- RESPONSE ---------------- */
  return NextResponse.json({
    success: true,
    upload_id: uploadId,
    total_rows: records.length,
    valid_rows: validRows.length,
    invalid_rows: errors.length,
    errors,
    preview: validRows.slice(0, 5),
  });
}

/* =====================================================
   VALIDATION LOGIC
===================================================== */

function validateRow(row: any) {
  if (!row.question_text) {
    throw new Error("question_text missing");
  }

  if (!["mcq_single", "mcq_multi"].includes(row.question_type)) {
    throw new Error("Invalid question_type");
  }

  if (!["easy", "medium", "hard"].includes(row.difficulty)) {
    throw new Error("Invalid difficulty");
  }

  const options = [
    { text: row.option_1, correct: row.option_1_correct },
    { text: row.option_2, correct: row.option_2_correct },
    { text: row.option_3, correct: row.option_3_correct },
    { text: row.option_4, correct: row.option_4_correct },
  ].filter(o => o.text);

  if (options.length < 2) {
    throw new Error("At least 2 options required");
  }

  const correctCount = options.filter(o => String(o.correct) === "1").length;

  if (row.question_type === "mcq_single" && correctCount !== 1) {
    throw new Error("MCQ single must have exactly one correct option");
  }

  if (row.question_type === "mcq_multi" && correctCount < 1) {
    throw new Error("MCQ multi must have at least one correct option");
  }
}
