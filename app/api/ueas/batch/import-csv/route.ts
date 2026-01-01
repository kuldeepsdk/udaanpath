// app/api/ueas/batch/import-csv/route.ts

import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import crypto from "crypto";
import { validateInternalApi } from "@/lib/apiAuth";

/* ---------------- Utils ---------------- */

function sha256(input: string) {
  return crypto.createHash("sha256").update(input).digest("hex");
}

function generatePassword() {
  return crypto.randomBytes(4).toString("hex"); // 8 chars
}

function cleanCode(str: string, len = 6) {
  return String(str || "")
    .replace(/[^A-Za-z]/g, "")
    .toUpperCase()
    .slice(0, len);
}

/* ---------------- API ---------------- */

export async function POST(req: Request) {
  try {
    console.log("▶️ Batch Student CSV Import");

    /* ---------- AUTH ---------- */
    const auth = await validateInternalApi(req);
    if (!auth.ok) return auth.response;

    const token = req.headers
      .get("authorization")
      ?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Missing token" },
        { status: 401 }
      );
    }

    /* ---------- BODY ---------- */
    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const upload_id = body?.upload_id;
    if (!upload_id) {
      return NextResponse.json(
        { success: false, error: "upload_id required" },
        { status: 400 }
      );
    }

    const db = await getDB();

    /* ---------- ORG ---------- */
    const [orgRows]: any = await db.execute(
      `
      SELECT org_id
      FROM UEAS_organization_users
      WHERE session_token = ?
      LIMIT 1
      `,
      [token]
    );

    if (!orgRows?.length) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const orgId = orgRows[0].org_id;
    const orgCode = cleanCode(orgId, 4);

    /* ---------- LOAD UPLOAD ---------- */
    const [uploadRows]: any = await db.execute(
      `
      SELECT batch_id, payload, imported_at
      FROM UEAS_batch_student_uploads
      WHERE id = ? AND org_id = ?
      LIMIT 1
      `,
      [upload_id, orgId]
    );

    if (!uploadRows?.length) {
      return NextResponse.json(
        { success: false, error: "Upload not found" },
        { status: 404 }
      );
    }

    if (uploadRows[0].imported_at) {
      return NextResponse.json(
        { success: false, error: "CSV already imported" },
        { status: 400 }
      );
    }

    const batchId = uploadRows[0].batch_id;

    /* ---------- PAYLOAD ---------- */
    let rows: any[] = [];
    
    try {
      const payload = uploadRows[0].payload;

      if (typeof payload === "string") {
        // payload is JSON string
        rows = JSON.parse(payload);
      } else if (Array.isArray(payload)) {
        // payload already parsed (✅ your case)
        rows = payload;
      } else {
        throw new Error("Unsupported payload format");
      }

    } catch (err: any) {
      console.error("CSV JSON parse error:", {
        payload: uploadRows[0].payload,
        error: err.message,
        payloadType: typeof uploadRows[0].payload,
      });

      return NextResponse.json(
        {
          success: false,
          error: "Corrupted CSV payload",
          details: err.message,
        },
        { status: 500 }
      );
    }


    if (!Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "No rows to import" },
        { status: 400 }
      );
    }

    /* ---------- BATCH ---------- */
    const [batchRows]: any = await db.execute(
      `
      SELECT name
      FROM UEAS_batches
      WHERE id = ? AND org_id = ?
      LIMIT 1
      `,
      [batchId, orgId]
    );

    if (!batchRows?.length) {
      return NextResponse.json(
        { success: false, error: "Batch not found" },
        { status: 404 }
      );
    }

    const batchCode = cleanCode(batchRows[0].name);

    /* ---------- SEQUENCE ---------- */
    const [countRows]: any = await db.execute(
      `
      SELECT COUNT(*) as total
      FROM UEAS_batch_students
      WHERE batch_id = ?
      `,
      [batchId]
    );

    let sequence = Number(countRows?.[0]?.total || 0) + 1;

    /* ---------- INSERT ---------- */
    const credentials: any[] = [];

    for (const r of rows) {
      if (!r?.name || !r?.email || !r?.mobile) continue;

      const roll_no = `${orgCode}-${batchCode}-${String(sequence++).padStart(4, "0")}`;
      const password = generatePassword();
      const password_hash = sha256(password);
      const studentId = crypto.randomUUID().slice(0, 16);

      // 👤 Student
      await db.execute(
        `
        INSERT IGNORE INTO UEAS_students
        (id, org_id, roll_no, name, email, mobile, password_hash)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
        [
          studentId,
          orgId,
          roll_no,
          r.name,
          r.email,
          r.mobile,
          password_hash,
        ]
      );

      // 🔗 Batch mapping
      await db.execute(
        `
        INSERT IGNORE INTO UEAS_batch_students
        (id, batch_id, student_id)
        VALUES (?, ?, ?)
        `,
        [crypto.randomUUID().slice(0, 16), batchId, studentId]
      );

      credentials.push({
        name: r.name,
        roll_no,
        password, // ⚠️ show only once
      });
    }

    /* ---------- MARK IMPORTED ---------- */
    await db.execute(
      `
      UPDATE UEAS_batch_student_uploads
      SET imported_at = NOW()
      WHERE id = ?
      `,
      [upload_id]
    );

    /* ---------- RESPONSE ---------- */
    return NextResponse.json(
      {
        success: true,
        imported: credentials.length,
        credentials,
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("❌ import-csv crashed:", err);

    return NextResponse.json(
      {
        success: false,
        error: "Import failed",
        debug: err?.message || String(err),
      },
      { status: 500 }
    );
  }
}
