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
  const { batch_id, students } = body;

  if (!batch_id || !Array.isArray(students) || students.length === 0) {
    return NextResponse.json(
      { success: false, error: "batch_id and students[] required" },
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

  const orgId = orgRows[0].org_id;

  for (const s of students) {
    const studentId = crypto.randomUUID().slice(0, 16);
    const password_hash = crypto
      .createHash("sha256")
      .update(s.password || "123456")
      .digest("hex");

    await db.execute(
      `
      INSERT IGNORE INTO UEAS_students
      (id, org_id, roll_no, name, email, mobile, password_hash)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [studentId, orgId, s.roll_no, s.name, s.email || null, s.mobile || null, password_hash]
    );

    await db.execute(
      `
      INSERT IGNORE INTO UEAS_batch_students (id, batch_id, student_id)
      VALUES (?, ?, ?)
      `,
      [crypto.randomUUID().slice(0, 16), batch_id, studentId]
    );
  }

  return NextResponse.json(
    { success: true, message: "Students added successfully" },
    { status: 200 }
  );
}
