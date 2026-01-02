// app/api/admin/organizations/update-status/route.ts

import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";

/* -------------------------------------------------
   Admin Auth Helper
------------------------------------------------- */
async function validateAdmin(req: Request) {
  const adminId = req.headers.get("x-admin-id");
  const adminSession = req.headers.get("x-admin-session");

  if (!adminId || !adminSession) {
    return { ok: false, response: NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    )};
  }

  const db = await getDB();

  const [rows]: any = await db.execute(
    `
    SELECT id
    FROM admin_users
    WHERE id = ?
      AND session_token = ?
      AND is_active = 1
    LIMIT 1
    `,
    [adminId, adminSession]
  );

  if (!rows.length) {
    return { ok: false, response: NextResponse.json(
      { success: false, error: "Invalid admin session" },
      { status: 401 }
    )};
  }

  return { ok: true };
}

/* -------------------------------------------------
   POST: Update Organization Status
------------------------------------------------- */
export async function POST(req: Request) {
  try {
    /* ---------- ADMIN AUTH ---------- */
    const auth = await validateAdmin(req);
    if (!auth.ok) return auth.response;

    /* ---------- BODY ---------- */
    const body = await req.json().catch(() => null);
    const org_id = body?.org_id;
    const status = body?.status;

    if (!org_id || ![0, 1, 2].includes(status)) {
      return NextResponse.json(
        {
          success: false,
          error: "org_id and valid status (0,1,2) required",
        },
        { status: 400 }
      );
    }

    const db = await getDB();

    /* ---------- CHECK ORG ---------- */
    const [orgRows]: any = await db.execute(
      `
      SELECT id, status
      FROM UEAS_organizations
      WHERE id = ?
      LIMIT 1
      `,
      [org_id]
    );

    if (!orgRows.length) {
      return NextResponse.json(
        { success: false, error: "Organization not found" },
        { status: 404 }
      );
    }

    const oldStatus = Number(orgRows[0].status);

    /* ---------- UPDATE STATUS ---------- */
    await db.execute(
      `
      UPDATE UEAS_organizations
      SET status = ?, updated_at = NOW()
      WHERE id = ?
      `,
      [status, org_id]
    );

    /* ---------- RESPONSE ---------- */
    return NextResponse.json(
      {
        success: true,
        org_id,
        old_status: oldStatus,
        new_status: status,
      },
      { status: 200 }
    );
  } catch (e: any) {
    console.error("❌ Update Org Status API Error:", e);
    return NextResponse.json(
      {
        success: false,
        error: e?.message || "Server error",
      },
      { status: 500 }
    );
  }
}
