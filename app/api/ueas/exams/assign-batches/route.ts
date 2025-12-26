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

  const { exam_id, batch_ids } = await req.json();

  if (!exam_id || !Array.isArray(batch_ids) || batch_ids.length === 0) {
    return NextResponse.json(
      { success: false, error: "exam_id and batch_ids[] required" },
      { status: 400 }
    );
  }

  const db = await getDB();

  for (const batchId of batch_ids) {
    await db.execute(
      `
      INSERT IGNORE INTO UEAS_exam_batches
      (id, exam_id, batch_id)
      VALUES (?, ?, ?)
      `,
      [crypto.randomUUID().slice(0, 16), exam_id, batchId]
    );
  }

  return NextResponse.json(
    { success: true, message: "Batches assigned to exam" },
    { status: 200 }
  );
}
