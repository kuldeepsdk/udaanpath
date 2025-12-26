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

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid JSON" }, { status: 400 });
  }

  const { name, description } = body;
  if (!name) {
    return NextResponse.json({ success: false, error: "Batch name required" }, { status: 400 });
  }

  const db = await getDB();

  const [userRows]: any = await db.execute(
    `
    SELECT u.org_id
    FROM UEAS_organization_users u
    WHERE u.session_token = ?
    LIMIT 1
    `,
    [token]
  );

  if (!userRows.length) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const batchId = crypto.randomUUID().slice(0, 16);

  await db.execute(
    `
    INSERT INTO UEAS_batches (id, org_id, name, description)
    VALUES (?, ?, ?, ?)
    `,
    [batchId, userRows[0].org_id, name, description || null]
  );

  return NextResponse.json(
    {
      success: true,
      batch: { id: batchId, name },
    },
    { status: 201 }
  );
}
