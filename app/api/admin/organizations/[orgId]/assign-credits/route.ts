import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import crypto from "crypto";
import { validateInternalApi } from "@/lib/apiAuth";

export async function POST(
  req: Request,
  context: { params: Promise<{ orgId: string }> }
) {
  
  const auth = await validateInternalApi(req);
  if (!auth.ok) return auth.response;

  const { orgId } = await context.params;
  
  if (!orgId) {
    return NextResponse.json(
      { success: false, error: "Organization ID missing" },
      { status: 400 }
    );
  }

  const adminId = req.headers.get("x-admin-id");
  const adminSession = req.headers.get("x-admin-session");

  if (!adminId || !adminSession) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const body = await req.json();
  const { credits, remarks } = body;

  if (!credits || credits <= 0) {
    return NextResponse.json(
      { success: false, error: "Invalid credits amount" },
      { status: 400 }
    );
  }

  const db = await getDB();

  /* ---------- VALIDATE ADMIN ---------- */
  const [adminRows]: any = await db.execute(
    `
    SELECT id
    FROM admin_users
    WHERE id = ? AND session_token = ? AND is_active = 1
    LIMIT 1
    `,
    [adminId, adminSession]
  );

  if (!adminRows.length) {
    return NextResponse.json(
      { success: false, error: "Invalid admin session" },
      { status: 401 }
    );
  }

  /* ---------- FETCH / CREATE WALLET ---------- */
  const [walletRows]: any = await db.execute(
    `
    SELECT *
    FROM UEAS_org_exam_wallet
    WHERE org_id = ?
    LIMIT 1
    `,
    [orgId]
  );

  if (!walletRows.length) {
    await db.execute(
      `
      INSERT INTO UEAS_org_exam_wallet
        (id, org_id, total_credits, used_credits, remaining_credits)
      VALUES
        (SUBSTRING(UUID(),1,16), ?, ?, 0, ?)
      `,
      [orgId, credits, credits]
    );
  } else {
    await db.execute(
      `
      UPDATE UEAS_org_exam_wallet
      SET
        total_credits = total_credits + ?,
        remaining_credits = remaining_credits + ?
      WHERE org_id = ?
      `,
      [credits, credits, orgId]
    );
  }

  /* ---------- CREDIT LOG ---------- */
  await db.execute(
    `
    INSERT INTO UEAS_org_exam_credit_logs
      (id, org_id, type, credits, reference_type, remarks)
    VALUES
      (SUBSTRING(UUID(),1,16), ?, 'admin_add', ?, 'admin', ?)
    `,
    [orgId, credits, remarks || "Credits added by admin"]
  );

  return NextResponse.json({
    success: true,
    org_id: orgId,
    added_credits: credits,
  });
}
