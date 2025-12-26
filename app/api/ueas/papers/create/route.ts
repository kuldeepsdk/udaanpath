import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import crypto from "crypto";
import { validateInternalApi } from "@/lib/apiAuth";

export async function POST(req: Request) {
  const auth = await validateInternalApi(req);
  if (!auth.ok) return auth.response;

  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) {
    return NextResponse.json({ success: false, error: "Missing token" }, { status: 401 });
  }

  const body = await req.json();
  const { name, description, default_duration_minutes, instructions } = body;

  if (!name) {
    return NextResponse.json(
      { success: false, error: "Paper name is required" },
      { status: 400 }
    );
  }

  const db = await getDB();

  const [orgRows]: any = await db.execute(
    `SELECT org_id FROM UEAS_organization_users WHERE session_token = ? LIMIT 1`,
    [token]
  );

  if (!orgRows.length) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const paperId = crypto.randomUUID().slice(0, 16);

  await db.execute(
    `
    INSERT INTO UEAS_papers
    (id, org_id, name, description, default_duration_minutes, instructions)
    VALUES (?, ?, ?, ?, ?, ?)
    `,
    [
      paperId,
      orgRows[0].org_id,
      name,
      description || null,
      default_duration_minutes || 60,
      instructions || null,
    ]
  );

  return NextResponse.json(
    {
      success: true,
      paper: {
        id: paperId,
        name,
      },
    },
    { status: 201 }
  );
}
