import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import crypto from "crypto";
import { validateInternalApi } from "@/lib/apiAuth";
import { parse } from "csv-parse/sync";

/* ---------------- Utils ---------------- */

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidMobile(mobile: string) {
  return /^[0-9]{10}$/.test(mobile);
}

/* ---------------- API ---------------- */

export async function POST(req: Request) {
  console.log("▶️ Batch Student CSV Upload (csv-parse)");

  /* -------- AUTH -------- */
  const auth = await validateInternalApi(req);
  if (!auth.ok) return auth.response;

  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) {
    return NextResponse.json(
      { success: false, error: "Missing token" },
      { status: 401 }
    );
  }

  /* -------- FORM DATA -------- */
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
  const batch_id = formData.get("batch_id") as string;

  if (!file || !batch_id) {
    return NextResponse.json(
      { success: false, error: "file and batch_id required" },
      { status: 400 }
    );
  }

  /* -------- READ CSV -------- */
  let records: any[] = [];
  try {
    const csvText = await file.text();

    records = parse(csvText, {
      columns: true,        // 👈 header row → object keys
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

  /* -------- ORG CHECK -------- */
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

  /* -------- BATCH OWNERSHIP -------- */
  const [batchRows]: any = await db.execute(
    `
    SELECT id
    FROM UEAS_batches
    WHERE id = ? AND org_id = ?
    LIMIT 1
    `,
    [batch_id, orgId]
  );

  if (!batchRows.length) {
    return NextResponse.json(
      { success: false, error: "Batch not found" },
      { status: 404 }
    );
  }

  /* -------- VALIDATION -------- */
  const validRows: any[] = [];
  const errors: any[] = [];

  records.forEach((r, index) => {
    const name = r.name?.trim();
    const email = r.email?.trim();
    const mobile = r.mobile?.trim();

    if (!name || name.length < 2) {
      errors.push({ row: index + 2, error: "Invalid name" }); // +2 (header + 1)
      return;
    }

    if (!email || !isValidEmail(email)) {
      errors.push({ row: index + 2, error: "Invalid email" });
      return;
    }

    if (!mobile || !isValidMobile(mobile)) {
      errors.push({ row: index + 2, error: "Invalid mobile" });
      return;
    }

    validRows.push({ name, email, mobile });
  });

  if (!validRows.length) {
    return NextResponse.json(
      {
        success: false,
        error: "No valid rows found",
        errors,
      },
      { status: 400 }
    );
  }

  /* -------- SAVE PAYLOAD -------- */
  const uploadId = crypto.randomUUID().slice(0, 16);

  await db.execute(
    `
    INSERT INTO UEAS_batch_student_uploads
    (id, org_id, batch_id, payload, total_rows)
    VALUES (?, ?, ?, ?, ?)
    `,
    [
      uploadId,
      orgId,
      batch_id,
      JSON.stringify(validRows),
      validRows.length,
    ]
  );

  /* -------- RESPONSE -------- */
  return NextResponse.json(
    {
      success: true,
      upload_id: uploadId,
      total_rows: records.length,
      valid_rows: validRows.length,
      invalid_rows: errors.length,
      preview: validRows.slice(0, 10),
      errors,
    },
    { status: 200 }
  );
}
