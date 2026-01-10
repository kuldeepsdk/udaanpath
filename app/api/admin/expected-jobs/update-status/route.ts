import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { validateAdminApi } from "@/lib/apiAuth";

export async function POST(req: Request) {
  const auth = await validateAdminApi(req);
  if (!auth.ok) return auth.response;

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const { id, action, notification_url } = body;

  if (!id || !action) {
    return NextResponse.json(
      { success: false, error: "id and action required" },
      { status: 400 }
    );
  }

  const allowedActions = ["release", "delay", "reset"];
  if (!allowedActions.includes(action)) {
    return NextResponse.json(
      { success: false, error: "Invalid action" },
      { status: 400 }
    );
  }

  const db = await getDB();

  /* ================= ACTION HANDLING ================= */

  if (action === "release") {
    if (!notification_url) {
      return NextResponse.json(
        { success: false, error: "notification_url required for release" },
        { status: 400 }
      );
    }

    await db.execute(
      `
      UPDATE expected_jobs
      SET
        status = 'released',
        notification_url = ?,
        published_at = NOW(),
        updated_at = NOW()
      WHERE id = ?
      `,
      [notification_url, id]
    );
  }

  if (action === "delay") {
    await db.execute(
      `
      UPDATE expected_jobs
      SET
        status = 'delayed',
        updated_at = NOW()
      WHERE id = ?
      `,
      [id]
    );
  }

  if (action === "reset") {
    await db.execute(
      `
      UPDATE expected_jobs
      SET
        status = 'waiting',
        notification_url = NULL,
        published_at = NULL,
        updated_at = NOW()
      WHERE id = ?
      `,
      [id]
    );
  }

  return NextResponse.json({
    success: true,
    admin: auth.admin,
    action,
  });
}
