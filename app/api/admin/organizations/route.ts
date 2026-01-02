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
   GET: Organizations List
--------------------------------------- */
export async function GET(req: Request) {
  try {
    const admin = await validateAdmin(req);
    if (!admin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);

    const page = Math.max(Number(searchParams.get("page") || 1), 1);
    const status = searchParams.get("status") || "all";
    const q = searchParams.get("q") || "";

    const limit = 20;
    const offset = (page - 1) * limit;

    const where: string[] = [];
    const params: any[] = [];

    if (status !== "all") {
      where.push("o.status = ?");
      params.push(status);
    }

    if (q) {
      where.push("(o.name LIKE ? OR o.email LIKE ?)");
      params.push(`%${q}%`, `%${q}%`);
    }

    const whereSQL = where.length
      ? `WHERE ${where.join(" AND ")}`
      : "";

    const db = await getDB();

    /* ---------- DATA ---------- */
    const [rows]: any = await db.execute(
      `
      SELECT
        o.id,
        o.name,
        o.email,
        o.status,
        o.created_at
      FROM UEAS_organizations o
      ${whereSQL}
      ORDER BY o.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
      `,
      params
    );

    /* ---------- COUNT ---------- */
    const [[count]]: any = await db.execute(
      `
      SELECT COUNT(*) AS total
      FROM UEAS_organizations o
      ${whereSQL}
      `,
      params
    );

    return NextResponse.json({
      success: true,
      organizations: rows,
      total: count.total,
      limit,
    });
  } catch (e: any) {
    console.error("❌ Admin Org List API Error:", e);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}
