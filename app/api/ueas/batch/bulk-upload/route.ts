import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import crypto from "crypto";
import { validateInternalApi } from "@/lib/apiAuth";

/**
 * POST /api/ueas/batch/bulk-upload
 * REST only
 */
export async function POST(req: Request) {
  // 🔐 Internal API protection
  const auth = await validateInternalApi(req);
  if (!auth.ok) return auth.response;

  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) {
    return NextResponse.json(
      { success: false, error: "Missing token" },
      { status: 401 }
    );
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const { batch_id, rows } = body;

  if (!batch_id || !Array.isArray(rows) || rows.length === 0) {
    return NextResponse.json(
      { success: false, error: "batch_id and rows[] required" },
      { status: 400 }
    );
  }

  const db = await getDB();

  // 🔎 Find org_id via token
  const [orgRows]: any = await db.execute(
    `
    SELECT org_id
    FROM UEAS_organization_users
    WHERE session_token = ?
    LIMIT 1
    `,
    [token]
  );

  if (!orgRows || orgRows.length === 0) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const orgId = orgRows[0].org_id;

  for (const r of rows) {
    if (!r.name || !r.roll_no) continue;

    const studentId = crypto.randomUUID().slice(0, 16);
    const password_hash = crypto
      .createHash("sha256")
      .update(r.password || "123456")
      .digest("hex");

    // 👤 Insert student
    await db.execute(
      `
      INSERT IGNORE INTO UEAS_students
      (id, org_id, roll_no, name, email, mobile, password_hash)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        studentId,
        orgId,
        r.roll_no,
        r.name,
        r.email || null,
        r.mobile || null,
        password_hash,
      ]
    );

    // 🔗 Map student → batch
    await db.execute(
      `
      INSERT IGNORE INTO UEAS_batch_students
      (id, batch_id, student_id)
      VALUES (?, ?, ?)
      `,
      [crypto.randomUUID().slice(0, 16), batch_id, studentId]
    );
  }

  return NextResponse.json(
    {
      success: true,
      message: "Bulk upload completed successfully",
      total_rows: rows.length,
    },
    { status: 200 }
  );
}
