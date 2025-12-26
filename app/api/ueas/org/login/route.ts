import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import crypto from "crypto";
import { validateInternalApi } from "@/lib/apiAuth";

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
    SELECT 
      u.id AS user_id,
      u.org_id,
      u.password_hash,
      u.is_active,
      o.status AS org_status,
      o.name AS org_name,
      o.slug AS org_slug
    FROM UEAS_organization_users u
    JOIN UEAS_organizations o ON o.id = u.org_id
    WHERE u.email = ?
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

  const user = rows[0];

  if (!user.is_active) {
    return NextResponse.json(
      { success: false, error: "User inactive" },
      { status: 403 }
    );
  }

  if (user.org_status !== 1) {
    return NextResponse.json(
      {
        success: false,
        error:
          user.org_status === 0
            ? "Organization pending approval"
            : "Organization blocked",
      },
      { status: 403 }
    );
  }

  const hash = crypto
    .createHash("sha256")
    .update(password)
    .digest("hex");

  if (hash !== user.password_hash) {
    return NextResponse.json(
      { success: false, error: "Invalid credentials" },
      { status: 401 }
    );
  }

  // 🔑 Issue stateless token
  const token = crypto.randomBytes(32).toString("hex");

  await db.execute(
    `
    UPDATE UEAS_organization_users
    SET session_token = ?, last_login_at = NOW()
    WHERE id = ?
    `,
    [token, user.user_id]
  );

  return NextResponse.json(
    {
      success: true,
      token,
      user: {
        id: user.user_id,
        org_id: user.org_id,
        org_name: user.org_name,
        org_slug: user.org_slug,
      },
    },
    { status: 200 }
  );
}
