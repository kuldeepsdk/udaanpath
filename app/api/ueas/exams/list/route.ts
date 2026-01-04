// app/api/ueas/exams/list/route.ts

import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { validateInternalApi } from "@/lib/apiAuth";

function combineDateTimeIST(dateInput: any, time: string): Date {
  let dateStr: string;

  if (dateInput instanceof Date) {
    const y = dateInput.getFullYear();
    const m = String(dateInput.getMonth() + 1).padStart(2, "0");
    const d = String(dateInput.getDate()).padStart(2, "0");
    dateStr = `${y}-${m}-${d}`;
  } else {
    dateStr = String(dateInput).slice(0, 10);
  }

  return new Date(`${dateStr}T${time}+05:30`);
}

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

  const db = await getDB();

  /* ---------- ORG ---------- */
  const [[orgUser]]: any = await db.execute(
    `
    SELECT org_id
    FROM UEAS_organization_users
    WHERE session_token = ?
    LIMIT 1
    `,
    [token]
  );

  if (!orgUser) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const org_id = orgUser.org_id;

  /* ---------- EXAMS ---------- */
  const [rows]: any = await db.execute(
    `
    SELECT
      e.id,
      e.name,
      e.exam_date,
      e.start_time,
      e.end_time,
      e.status,
      e.created_at
    FROM UEAS_exams e
    WHERE e.org_id = ?
    ORDER BY e.exam_date DESC, e.start_time DESC
    LIMIT 20
    `,
    [org_id]
  );

  const now = new Date();
  const updates: Promise<any>[] = [];

  const exams = rows.map((e: any) => {
    const examStart = combineDateTimeIST(e.exam_date, e.start_time);
    const examEnd = combineDateTimeIST(e.exam_date, e.end_time);

    let correctStatus: "scheduled" | "active" | "completed";

    if (now < examStart) correctStatus = "scheduled";
    else if (now < examEnd) correctStatus = "active";
    else correctStatus = "completed";

    if (e.status !== correctStatus) {
      updates.push(
        db.execute(
          `UPDATE UEAS_exams SET status = ? WHERE id = ?`,
          [correctStatus, e.id]
        )
      );
    }

    return {
      ...e,
      status: correctStatus,
      exam_start_at: examStart.toISOString(),
      exam_end_at: examEnd.toISOString(),
    };
  });

  if (updates.length) await Promise.all(updates);

  /* ---------- CREDITS ---------- */
  const [walletRows]: any = await db.execute(
    `
    SELECT total_credits, used_credits, remaining_credits
    FROM UEAS_org_exam_wallet
    WHERE org_id = ?
    LIMIT 1
    `,
    [org_id]
  );

  const credits = walletRows.length
    ? {
        enabled: true,
        total: Number(walletRows[0].total_credits),
        used: Number(walletRows[0].used_credits),
        remaining: Number(walletRows[0].remaining_credits),
      }
    : {
        enabled: false,
        total: 0,
        used: 0,
        remaining: 0,
      };

  return NextResponse.json(
    {
      success: true,
      server_now: now.toISOString(),
      exams,
      credits,
    },
    { status: 200 }
  );
}
