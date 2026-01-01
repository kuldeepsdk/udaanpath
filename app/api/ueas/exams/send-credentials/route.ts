import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { validateInternalApi } from "@/lib/apiAuth";
import { startCredentialsWorker } from "./worker";

export async function POST(req: Request) {
  const auth = await validateInternalApi(req);
  if (!auth.ok) return auth.response;

  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  const { exam_id, batch_id } = await req.json();
  const db = await getDB();

  const [[org]]: any = await db.execute(
    `SELECT org_id FROM UEAS_organization_users WHERE session_token=?`,
    [token]
  );

  /* 🔄 mark processing */
  await db.execute(
    `
    UPDATE UEAS_exam_batches
    SET credentials_status='processing',
        credentials_started_at=NOW()
    WHERE exam_id=? AND batch_id=?
    `,
    [exam_id, batch_id]
  );
  console.log("calling startCredentialsWorker");
  /* 🚀 background worker */
  setImmediate(() => {
    startCredentialsWorker({
      examId: exam_id,
      batchId: batch_id,
      orgId: org.org_id,
    });
  });

  /* ⚡ immediate response */
  return NextResponse.json(
    {
      success: true,
      message: "Credentials sending started in background",
    },
    { status: 202 }
  );
}
