import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import crypto from "crypto";
import { validateInternalApi } from "@/lib/apiAuth";

/**
 * POST /api/ueas/student/login
 * Pure REST API
 * No cookies, no redirect
 */
export async function POST(req: Request) {
  const auth = await validateInternalApi(req);
  if (!auth.ok) return auth.response;

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const { roll_no, password } = body;

  if (!roll_no || !password) {
    return NextResponse.json(
      { success: false, error: "roll_no and password required" },
      { status: 400 }
    );
  }

  const db = await getDB();

  const [rows]: any = await db.execute(
    `
    SELECT id, name, roll_no, password_hash, is_active
    FROM UEAS_students
    WHERE roll_no = ?
    LIMIT 1
    `,
    [roll_no]
  );

  if (!rows || rows.length === 0) {
    return NextResponse.json(
      { success: false, error: "Invalid credentials" },
      { status: 401 }
    );
  }

  const student = rows[0];

  if (!student.is_active) {
    return NextResponse.json(
      { success: false, error: "Student account inactive" },
      { status: 403 }
    );
  }

  const hash = crypto
    .createHash("sha256")
    .update(password)
    .digest("hex");

  if (hash !== student.password_hash) {
    return NextResponse.json(
      { success: false, error: "Invalid credentials" },
      { status: 401 }
    );
  }

  // 🔑 Issue secure session token
  const session_token = crypto.randomBytes(32).toString("hex");

  await db.execute(
    `
    UPDATE UEAS_students
    SET session_token = ?
    WHERE id = ?
    `,
    [session_token, student.id]
  );

  return NextResponse.json(
    {
      success: true,
      token: session_token,
      student: {
        id: student.id,
        name: student.name,
        roll_no: student.roll_no,
      },
    },
    { status: 200 }
  );
}
