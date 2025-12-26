import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import crypto from "crypto";
import { validateInternalApi } from "@/lib/apiAuth";

export async function POST(req: Request) {
  const auth = await validateInternalApi(req);
  if (!auth.ok) return auth.response;

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const { session_id, otp } = body;

  if (!session_id || !otp) {
    return NextResponse.json(
      { success: false, error: "session_id and otp required" },
      { status: 400 }
    );
  }

  const db = await getDB();

  const [rows]: any = await db.execute(
    `
    SELECT *
    FROM UEAS_org_registration_sessions
    WHERE id = ? AND verified = 0
    LIMIT 1
    `,
    [session_id]
  );

  if (!rows.length) {
    return NextResponse.json(
      { success: false, error: "Invalid or expired session" },
      { status: 404 }
    );
  }

  const session = rows[0];

  if (session.otp !== otp) {
    return NextResponse.json(
      { success: false, error: "Invalid OTP" },
      { status: 401 }
    );
  }

  if (new Date(session.otp_expires_at) < new Date()) {
    return NextResponse.json(
      { success: false, error: "OTP expired" },
      { status: 410 }
    );
  }

  // 🔐 Create org
  const org_id = crypto.randomUUID().slice(0, 16);
  const admin_id = crypto.randomUUID().slice(0, 16);
  const slug = slugify(session.org_name);

  
function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 180);
}
  //(id, name, slug, type, email, mobile, status)
  await db.execute(
    `
    INSERT INTO UEAS_organizations
      (id, name,slug, type, email, mobile, city, status)
    VALUES
      (?, ?, ?, ?, ?,?,?, 0)
    `,
    [
      org_id,
      session.org_name,
      slug,
      session.org_type,
      session.email,
      session.mobile,
      session.city,
    ]
  );

  // 🔐 Create admin user
  await db.execute(
    `
    INSERT INTO UEAS_organization_users
    
      (id, org_id, name, email, mobile, password_hash, role)
    VALUES
      (?, ?, ?, ?, ?, ?, 'admin')
    `,
    [
      admin_id,
      org_id,
      session.admin_name,
      session.email,
      session.mobile|| null,
      session.password_hash,
    ]
  );

  // ✅ Mark verified
  await db.execute(
    `
    UPDATE UEAS_org_registration_sessions
    SET verified = 1
    WHERE id = ?
    `,
    [session_id]
  );

  return NextResponse.json(
    {
      success: true,
      message: "Organization registered successfully",
    },
    { status: 200 }
  );
}
