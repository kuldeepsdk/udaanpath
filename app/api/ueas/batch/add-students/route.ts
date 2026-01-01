import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import crypto from "crypto";
import { validateInternalApi } from "@/lib/apiAuth";

/* ---------------- Utils ---------------- */

function sha256(input: string) {
  return crypto.createHash("sha256").update(input).digest("hex");
}

function generatePassword() {
  return crypto.randomBytes(6).toString("hex"); // 8 chars
}
function hashPassword(password: string, salt: string) {
  return crypto
    .createHash("sha256")
    .update(password + salt)
    .digest("hex");
}
function generateBatchCode(name: string) {
  return name.replace(/\s+/g, "").toUpperCase().slice(0, 8);
}

/* ---------------- API ---------------- */

export async function POST(req: Request) {
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

  const { batch_id, students } = body;

  if (!batch_id || !Array.isArray(students) || students.length === 0) {
    return NextResponse.json(
      { success: false, error: "batch_id and students[] required" },
      { status: 400 }
    );
  }

  const db = await getDB();

  /* ---------------- ORG ---------------- */
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

  // ✅ Generate org prefix safely
  const orgCode = orgId.slice(0, 4).toUpperCase();

  /* ---------------- BATCH ---------------- */
  const [batchRows]: any = await db.execute(
    `SELECT name FROM UEAS_batches WHERE id = ? AND org_id = ? LIMIT 1`,
    [batch_id, orgId]
  );

  if (!batchRows.length) {
    return NextResponse.json(
      { success: false, error: "Batch not found" },
      { status: 404 }
    );
  }

  const batchCode = generateBatchCode(batchRows[0].name);

  /* ---------------- EXISTING COUNT ---------------- */
  const [countRows]: any = await db.execute(
    `SELECT COUNT(*) as total FROM UEAS_batch_students WHERE batch_id = ?`,
    [batch_id]
  );

  let sequence = countRows[0].total + 1;

  const created: any[] = [];

  /* ---------------- INSERT STUDENTS ---------------- */
  for (const s of students) {
    // ✅ Mandatory fields
    if (!s.name || !s.email || !s.mobile) continue;

    const seq = String(sequence++).padStart(4, "0");
    const roll_no = `${orgCode}-${batchCode}-${seq}`;

    const password = generatePassword();

    const password_salt = crypto.randomBytes(16).toString("hex");
    const password_hash = hashPassword(password, password_salt);

    const studentId = crypto.randomUUID().slice(0, 16);

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
        roll_no,
        s.name,
        s.email,
        s.mobile,
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

    // 🔁 Return credentials ONCE
    created.push({
      name: s.name,
      roll_no,
      password,
    });
  }

  return NextResponse.json(
    {
      success: true,
      created_count: created.length,
      credentials: created, // ⚠️ show once only
    },
    { status: 200 }
  );
}
