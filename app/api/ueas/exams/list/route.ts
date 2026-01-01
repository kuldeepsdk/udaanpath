import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { validateInternalApi } from "@/lib/apiAuth";

/* ---------- IST SAFE COMBINER ---------- */
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
  /* ---------- AUTH ---------- */
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

  /* ---------- FETCH EXAMS ---------- */
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
    JOIN UEAS_organization_users u ON u.org_id = e.org_id
    WHERE u.session_token = ?
    ORDER BY e.exam_date DESC, e.start_time DESC
    LIMIT 20
    `,
    [token]
  );

  const now = new Date(); // ✅ DO NOT add IST offset manually

  const updates: Promise<any>[] = [];

  const exams = rows.map((e: any) => {
    const examStart = combineDateTimeIST(e.exam_date, e.start_time);
    const examEnd = combineDateTimeIST(e.exam_date, e.end_time);

    let correctStatus: "scheduled" | "active" | "completed";

    if (now < examStart) {
      correctStatus = "scheduled";
    } else if (now >= examStart && now < examEnd) {
      correctStatus = "active";
    } else {
      correctStatus = "completed";
    }

    /* ---------- AUTO DB FIX ---------- */
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
      status: correctStatus,              // ✅ always correct
      exam_start_at: examStart.toISOString(),
      exam_end_at: examEnd.toISOString(),
    };
  });

  /* ---------- APPLY STATUS FIXES ---------- */
  if (updates.length) {
    await Promise.all(updates);
  }

  return NextResponse.json(
    {
      success: true,
      server_now: now.toISOString(),
      exams,
    },
    { status: 200 }
  );
}
