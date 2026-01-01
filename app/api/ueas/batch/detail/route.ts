import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { validateInternalApi } from "@/lib/apiAuth";

export async function GET(req: Request) {
  const auth = await validateInternalApi(req);
  if (!auth.ok) return auth.response;

  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) {
    return NextResponse.json(
      { success: false, error: "Missing token" },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(req.url);
  const batch_id = searchParams.get("batch_id");

  if (!batch_id) {
    return NextResponse.json(
      { success: false, error: "batch_id required" },
      { status: 400 }
    );
  }

  const db = await getDB();

  /* -------- Batch -------- */
  const [batchRows]: any = await db.execute(
    `
    SELECT b.id, b.name, b.description, b.created_at
    FROM UEAS_batches b
    JOIN UEAS_organization_users u ON u.org_id = b.org_id
    WHERE b.id = ? AND u.session_token = ?
    LIMIT 1
    `,
    [batch_id, token]
  );

  if (!batchRows.length) {
    return NextResponse.json(
      { success: false, error: "Batch not found" },
      { status: 404 }
    );
  }

  /* -------- Students -------- */
  const [students]: any = await db.execute(
    `
    SELECT s.id, s.roll_no, s.name, s.email, s.mobile
    FROM UEAS_batch_students bs
    JOIN UEAS_students s ON s.id = bs.student_id
    WHERE bs.batch_id = ?
    ORDER BY s.roll_no
    `,
    [batch_id]
  );

  return NextResponse.json(
    {
      success: true,
      batch: batchRows[0],
      students,
    },
    { status: 200 }
  );
}
