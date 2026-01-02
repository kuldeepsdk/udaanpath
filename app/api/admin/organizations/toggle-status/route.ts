import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";

/* ---------------------------------------
   Admin Auth Validator
--------------------------------------- */
async function validateAdmin(req: Request) {
  const adminId = req.headers.get("x-admin-id");
  const adminSession = req.headers.get("x-admin-session");

  if (!adminId || !adminSession) {
    return null;
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

  return rows.length ? rows[0] : null;
}

/* ---------------------------------------
   POST: Toggle Org Status
--------------------------------------- */
export async function POST(req: Request) {
  try {
    const admin = await validateAdmin(req);
    if (!admin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => null);
    const org_id = body?.org_id;

    if (!org_id) {
      return NextResponse.json(
        { success: false, error: "org_id required" },
        { status: 400 }
      );
    }

    const db = await getDB();

    /* ---------- FETCH CURRENT STATUS ---------- */
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

    const currentStatus = String(orgRows[0].status);
    const nextStatus =
      currentStatus === "active" ? "blocked" : "active";

    /* ---------- UPDATE ---------- */
    await db.execute(
      `
      UPDATE UEAS_organizations
      SET status = ?, updated_at = NOW()
      WHERE id = ?
      `,
      [nextStatus, org_id]
    );
    
    return NextResponse.json({
      success: true,
      org_id,
      old_status: currentStatus,
      new_status: nextStatus,
    });
  } catch (e: any) {
    console.error("❌ Toggle Org Status API Error:", e);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}
