import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { validateInternalApi } from "@/lib/apiAuth";

export async function POST(req: Request) {
  console.log("▶️ Paper Update API called");

  /* ---------------- AUTH ---------------- */
  const auth = await validateInternalApi(req);
  if (!auth.ok) return auth.response;

  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) {
    return NextResponse.json(
      { success: false, error: "Missing token" },
      { status: 401 }
    );
  }

  /* ---------------- BODY ---------------- */
  const body = await req.json();
  const {
    paper_id,
    name,
    description,
    default_duration_minutes,
    is_active,
  } = body;

  if (!paper_id) {
    return NextResponse.json(
      { success: false, error: "paper_id is required" },
      { status: 400 }
    );
  }

  const db = await getDB();

  /* ---------------- VERIFY PAPER OWNERSHIP ---------------- */
  const [paperRows]: any = await db.execute(
    `
    SELECT p.id
    FROM UEAS_papers p
    JOIN UEAS_organization_users u ON u.org_id = p.org_id
    WHERE p.id = ? AND u.session_token = ?
    LIMIT 1
    `,
    [paper_id, token]
  );

  if (!paperRows.length) {
    return NextResponse.json(
      { success: false, error: "Paper not found or unauthorized" },
      { status: 404 }
    );
  }

  /* ---------------- BUILD UPDATE QUERY ---------------- */
  const fields: string[] = [];
  const values: any[] = [];

  if (typeof name === "string" && name.trim()) {
    fields.push("name = ?");
    values.push(name.trim());
  }

  if (typeof description === "string") {
    fields.push("description = ?");
    values.push(description || null);
  }

  if (
    typeof default_duration_minutes === "number" &&
    default_duration_minutes > 0
  ) {
    fields.push("default_duration_minutes = ?");
    values.push(default_duration_minutes);
  }

  if (is_active === 0 || is_active === 1) {
    fields.push("is_active = ?");
    values.push(is_active);
  }

  if (fields.length === 0) {
    return NextResponse.json(
      { success: false, error: "No valid fields to update" },
      { status: 400 }
    );
  }

  /* ---------------- EXECUTE UPDATE ---------------- */
  await db.execute(
    `
    UPDATE UEAS_papers
    SET ${fields.join(", ")}
    WHERE id = ?
    `,
    [...values, paper_id]
  );

  return NextResponse.json(
    {
      success: true,
      message: "Paper updated successfully",
    },
    { status: 200 }
  );
}
