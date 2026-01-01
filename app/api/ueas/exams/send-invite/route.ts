import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { validateInternalApi } from "@/lib/apiAuth";
import { startInviteWorker } from "./worker";

export async function POST(req: Request) {
  const auth = await validateInternalApi(req);
  if (!auth.ok) return auth.response;

  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) {
    return NextResponse.json({ success: false, error: "Missing token" }, { status: 401 });
  }

  const { exam_id, batch_id } = await req.json();

  if (!exam_id || !batch_id) {
    return NextResponse.json(
      { success: false, error: "exam_id and batch_id required" },
      { status: 400 }
    );
  }

  const db = await getDB();

  /* 🔐 ORG CHECK */
  const [org]: any = await db.execute(
    `SELECT org_id FROM UEAS_organization_users WHERE session_token = ? LIMIT 1`,
    [token]
  );

  if (!org.length) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  /* 🚦 UPDATE STATUS → processing */
  await db.execute(
    `
    UPDATE UEAS_exam_batches
    SET invite_status = 'processing',
        invite_started_at = NOW()
    WHERE exam_id = ? AND batch_id = ?
    `,
    [exam_id, batch_id]
  );

  /* 🚀 FIRE & FORGET WORKER */
  startInviteWorker({
    exam_id,
    batch_id,
    org_id: org[0].org_id,
  });

  /* ⚡ IMMEDIATE RESPONSE */
  return NextResponse.json({
    success: true,
    message: "Invitation sending started in background",
  });
}
