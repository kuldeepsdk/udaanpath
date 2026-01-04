// app/api/ueas/exams/detail/route.ts

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
  const exam_id = searchParams.get("exam_id");

  if (!exam_id) {
    return NextResponse.json(
      { success: false, error: "exam_id required" },
      { status: 400 }
    );
  }

  const db = await getDB();

  /* ---------- EXAM + ORG ---------- */
  const [examRows]: any = await db.execute(
    `
    SELECT e.*
    FROM UEAS_exams e
    JOIN UEAS_organization_users u ON u.org_id = e.org_id
    WHERE e.id = ? AND u.session_token = ?
    LIMIT 1
    `,
    [exam_id, token]
  );

  if (!examRows.length) {
    return NextResponse.json(
      { success: false, error: "Exam not found" },
      { status: 404 }
    );
  }

  const exam = examRows[0];
  const org_id = exam.org_id;

  /* ---------- BATCHES ---------- */
  const [batches]: any = await db.execute(
    `
    SELECT
      b.id,
      b.name,

      -- INVITE
      eb.invite_status,
      eb.invite_started_at,
      eb.invite_completed_at,

      -- CREDENTIALS
      eb.credentials_status,
      eb.credentials_started_at,
      eb.credentials_completed_at,

      -- legacy booleans (safe fallback)
      eb.invite_sent,
      eb.credentials_sent

    FROM UEAS_exam_batches eb
    JOIN UEAS_batches b ON b.id = eb.batch_id
    WHERE eb.exam_id = ?
    ORDER BY b.created_at ASC
    `,
    [exam_id]
  );

  /* ---------- EXAM CREDIT WALLET ---------- */
  const [walletRows]: any = await db.execute(
    `
    SELECT
      total_credits,
      used_credits,
      remaining_credits
    FROM UEAS_org_exam_wallet
    WHERE org_id = ?
    LIMIT 1
    `,
    [org_id]
  );

  let credits;

  if (walletRows.length) {
    const w = walletRows[0];
    credits = {
      enabled: true,
      total: Number(w.total_credits || 0),
      used: Number(w.used_credits || 0),
      remaining: Number(w.remaining_credits || 0),
    };
  } else {
    // 🛡️ Backward compatibility for old orgs
    credits = {
      enabled: false,
      total: 0,
      used: 0,
      remaining: 0,
      note: "Credit system not initialized for this organization",
    };
  }

  return NextResponse.json(
    {
      success: true,
      exam,
      batches,
      credits,
    },
    { status: 200 }
  );
}
