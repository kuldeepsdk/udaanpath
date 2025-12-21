import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import crypto from "crypto";
import { validateInternalApi } from "@/lib/apiAuth";

/**
 * POST /api/admin/login
 * Pure REST API
 * - No cookies
 * - No redirect
 * - Postman accessible
 */
export async function POST(req: Request) {
  // 🔐 Internal API protection
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

  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json(
      { success: false, error: "Missing credentials" },
      { status: 400 }
    );
  }

  const db = await getDB();

  const [rows]: any = await db.execute(
    `
    SELECT id, email, password_hash
    FROM admin_users
    WHERE email = ? AND is_active = 1
    LIMIT 1
    `,
    [email]
  );

  if (!rows || rows.length === 0) {
    return NextResponse.json(
      { success: false, error: "Invalid credentials" },
      { status: 401 }
    );
  }

  const admin = rows[0];

  const hash = crypto
    .createHash("sha256")
    .update(password)
    .digest("hex");

  if (hash !== admin.password_hash) {
    return NextResponse.json(
      { success: false, error: "Invalid credentials" },
      { status: 401 }
    );
  }

  // ✅ SUCCESS (NO SESSION HERE)
  return NextResponse.json(
    {
      success: true,
      admin: {
        id: admin.id,
        email: admin.email,
      },
    },
    { status: 200 }
  );
}
