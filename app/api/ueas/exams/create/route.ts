// app/api/ueas/exams/create/route.ts

import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import crypto from "crypto";
import { validateInternalApi } from "@/lib/apiAuth";

export async function POST(req: Request) {
  const auth = await validateInternalApi(req);
  if (!auth.ok) return auth.response;

  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) {
    return NextResponse.json(
      { success: false, error: "Missing token" },
      { status: 401 }
    );
  }

  const body = await req.json();
  const {
    name,
    paper_id,
    exam_date,
    start_time,
    end_time,
    duration_minutes,
    show_score_after_exam,
    show_answers,
    negative_marking,
    randomize_questions,
    randomize_options,
  } = body;

  if (!name || !paper_id || !exam_date || !start_time || !end_time) {
    return NextResponse.json(
      { success: false, error: "Missing required exam fields" },
      { status: 400 }
    );
  }

  const db = await getDB();

  /* ---------- ORG ---------- */
  const [orgRows]: any = await db.execute(
    `
    SELECT org_id
    FROM UEAS_organization_users
    WHERE session_token = ?
    LIMIT 1
    `,
    [token]
  );

  if (!orgRows.length) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const org_id = orgRows[0].org_id;

  /* =====================================================
     TRANSACTION (CREDITS + EXAM CREATE)
  ===================================================== */
  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    /* ---------- FETCH / INIT WALLET ---------- */
    const [walletRows]: any = await conn.execute(
      `
      SELECT id, total_credits, used_credits, remaining_credits
      FROM UEAS_org_exam_wallet
      WHERE org_id = ?
      LIMIT 1
      `,
      [org_id]
    );

    let wallet;

    if (!walletRows.length) {
      // ⚠️ legacy org (created before credits system)
      await conn.execute(
        `
        INSERT INTO UEAS_org_exam_wallet
          (id, org_id, total_credits, used_credits, remaining_credits)
        VALUES
          (SUBSTRING(UUID(),1,16), ?, 0, 0, 0)
        `,
        [org_id]
      );

      wallet = {
        remaining_credits: 0,
        used_credits: 0,
        total_credits: 0,
      };
    } else {
      wallet = walletRows[0];
    }

    /* ---------- CREDIT CHECK ---------- */
    if (Number(wallet.remaining_credits) <= 0) {
      await conn.rollback();
      return NextResponse.json(
        {
          success: false,
          error: "No exam credits remaining. Please purchase more credits.",
          code: "NO_CREDITS",
        },
        { status: 403 }
      );
    }

    /* ---------- CREATE EXAM ---------- */
    const examId = crypto.randomUUID().slice(0, 16);

    await conn.execute(
      `
      INSERT INTO UEAS_exams
      (
        id, org_id, paper_id, name,
        exam_date, start_time, end_time, duration_minutes,
        show_score_after_exam, show_answers, negative_marking,
        randomize_questions, randomize_options
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        examId,
        org_id,
        paper_id,
        name,
        exam_date,
        start_time,
        end_time,
        duration_minutes || 60,
        show_score_after_exam ? 1 : 0,
        show_answers ? 1 : 0,
        negative_marking ? 1 : 0,
        randomize_questions !== false ? 1 : 0,
        randomize_options !== false ? 1 : 0,
      ]
    );

    /* ---------- DEDUCT CREDIT ---------- */
    await conn.execute(
      `
      UPDATE UEAS_org_exam_wallet
      SET
        used_credits = used_credits + 1,
        remaining_credits = remaining_credits - 1,
        updated_at = NOW()
      WHERE org_id = ?
      `,
      [org_id]
    );

    /* ---------- CREDIT LOG ---------- */
    await conn.execute(
      `
      INSERT INTO UEAS_org_exam_credit_logs
        (id, org_id, type, credits, reference_type, reference_id, remarks)
      VALUES
        (SUBSTRING(UUID(),1,16), ?, 'debit', 1, 'exam', ?, 'Exam created')
      `,
      [org_id, examId]
    );

    await conn.commit();

    return NextResponse.json(
      {
        success: true,
        exam: {
          id: examId,
          name,
          exam_date,
          start_time,
          end_time,
        },
      },
      { status: 201 }
    );
  } catch (e: any) {
    await conn.rollback();
    console.error("❌ Create Exam Error:", e);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create exam",
      },
      { status: 500 }
    );
  } finally {
    conn.release();
  }
}
