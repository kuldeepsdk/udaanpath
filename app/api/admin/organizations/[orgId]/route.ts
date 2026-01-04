// app/api/admin/organizations/[orgId]/route.ts
import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { validateInternalApi } from "@/lib/apiAuth";

export async function GET(
  req: Request,
  context: { params: Promise<{ orgId: string }> }
) {
  const auth = await validateInternalApi(req);
  if (!auth.ok) return auth.response;

  // ✅ Next 16: params is Promise
  const { orgId } = await context.params;

  if (!orgId) {
    return NextResponse.json(
      { success: false, error: "Organization ID missing" },
      { status: 400 }
    );
  }

  // ✅ admin auth headers
  const adminId = req.headers.get("x-admin-id");
  const adminSession = req.headers.get("x-admin-session");

  if (!adminId || !adminSession) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const db = await getDB();

  // ✅ validate admin
  const [adminRows]: any = await db.execute(
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

  if (!adminRows.length) {
    return NextResponse.json(
      { success: false, error: "Invalid admin session" },
      { status: 401 }
    );
  }

  // ✅ organization
  const [orgRows]: any = await db.execute(
    `
    SELECT id, name, email, mobile, city, status, created_at, updated_at
    FROM UEAS_organizations
    WHERE id = ?
    LIMIT 1
    `,
    [orgId]
  );

  if (!orgRows.length) {
    return NextResponse.json(
      { success: false, error: "Organization not found" },
      { status: 404 }
    );
  }

  // ✅ credits (handle old orgs with no wallet row)
  const [walletRows]: any = await db.execute(
    `
    SELECT total_credits, used_credits, remaining_credits
    FROM UEAS_org_exam_wallet
    WHERE org_id = ?
    LIMIT 1
    `,
    [orgId]
  );

  const wallet = walletRows?.[0] || null;

  const credits = wallet
    ? {
        total: Number(wallet.total_credits || 0),
        used: Number(wallet.used_credits || 0),
        remaining: Number(wallet.remaining_credits || 0),
      }
    : { total: 0, used: 0, remaining: 0 };

  return NextResponse.json(
    {
      success: true,
      organization: orgRows[0],
      credits,
    },
    { status: 200 }
  );
}
