import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import crypto from "crypto";
import { validateInternalApi } from "@/lib/apiAuth";

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 180);
}

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

  const {
    org_name,
    org_type,
    org_email,
    org_mobile,
    admin_name,
    admin_email,
    admin_mobile,
    password,
  } = body;

  if (
    !org_name ||
    !org_type ||
    !org_email ||
    !org_mobile ||
    !admin_name ||
    !admin_email ||
    !password
  ) {
    return NextResponse.json(
      { success: false, error: "Missing required fields" },
      { status: 400 }
    );
  }

  if (!["school", "college", "coaching", "other"].includes(org_type)) {
    return NextResponse.json(
      { success: false, error: "Invalid org_type" },
      { status: 400 }
    );
  }

  const db = await getDB();

  // ❌ Duplicate org check
  const [orgExists]: any = await db.execute(
    `SELECT id FROM UEAS_organizations WHERE email = ? OR mobile = ? LIMIT 1`,
    [org_email, org_mobile]
  );

  if (orgExists.length > 0) {
    return NextResponse.json(
      { success: false, error: "Organization already exists" },
      { status: 409 }
    );
  }

  const orgId = crypto.randomUUID().slice(0, 16);
  const userId = crypto.randomUUID().slice(0, 16);
  const slug = slugify(org_name);

  const password_hash = crypto
    .createHash("sha256")
    .update(password)
    .digest("hex");

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    await conn.execute(
      `
      INSERT INTO UEAS_organizations
      (id, name, slug, type, email, mobile, status)
      VALUES (?, ?, ?, ?, ?, ?, 0)
      `,
      [orgId, org_name, slug, org_type, org_email, org_mobile]
    );

    await conn.execute(
      `
      INSERT INTO UEAS_organization_users
      (id, org_id, name, email, mobile, password_hash, role)
      VALUES (?, ?, ?, ?, ?, ?, 'admin')
      `,
      [userId, orgId, admin_name, admin_email, admin_mobile || null, password_hash]
    );

    await conn.commit();
  } catch (err) {
    await conn.rollback();
    console.error(err);
    return NextResponse.json(
      { success: false, error: "Failed to register organization" },
      { status: 500 }
    );
  } finally {
    conn.release();
  }

  return NextResponse.json(
    {
      success: true,
      org: {
        id: orgId,
        name: org_name,
        slug,
        status: 0, // pending approval
      },
    },
    { status: 201 }
  );
}
