import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { validateAdminApi } from "@/lib/apiAuth";

/**
 * GET: list all study categories
 */
export async function GET(req: Request) {
  try {
    const auth = await validateAdminApi(req);
    if (!auth.ok) return auth.response;

    const db = await getDB();

    const [rows]: any = await db.execute(`
      SELECT id, name, slug, is_published
      FROM courseapp_studycategory
      ORDER BY name ASC
    `);

    return NextResponse.json({
      success: true,
      data: rows,
    });
  } catch (e) {
    console.error("Fetch study categories failed:", e);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
