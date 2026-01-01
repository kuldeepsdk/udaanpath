// app/api/ueas/exams/students/route.ts

import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { validateInternalApi } from "@/lib/apiAuth";

/* ---------- utils ---------- */
function toInt(v: string | null, def: number) {
  const n = Number.parseInt(String(v ?? ""), 10);
  return Number.isFinite(n) ? n : def;
}

export async function GET(req: Request) {
  try {
    /* ---------- AUTH ---------- */
    const auth = await validateInternalApi(req);
    if (!auth.ok) return auth.response;

    const token = req.headers
      .get("authorization")
      ?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Missing token" },
        { status: 401 }
      );
    }

    /* ---------- QUERY PARAMS ---------- */
    const { searchParams } = new URL(req.url);

    const exam_id = searchParams.get("exam_id");
    if (!exam_id) {
      return NextResponse.json(
        { success: false, error: "exam_id required" },
        { status: 400 }
      );
    }

    const page = Math.max(toInt(searchParams.get("page"), 1), 1);
    const limit = Math.min(
      Math.max(toInt(searchParams.get("limit"), 20), 1),
      100
    );
    const offset = (page - 1) * limit;

    const search = searchParams.get("search") || "";
    const invite_status = searchParams.get("invite_status");
    const credentials_status = searchParams.get("credentials_status");
    const exam_status = searchParams.get("exam_status");

    const like = `%${search}%`;

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

    if (!orgRows?.length) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const orgId = orgRows[0].org_id;

    /* ---------- BUILD WHERE ---------- */
    const where: string[] = [];
    const values: any[] = [];

    where.push("eb.exam_id = ?");
    values.push(exam_id);

    where.push("b.org_id = ?");
    values.push(orgId);

    if (search) {
      where.push(`
        (
          s.name LIKE ?
          OR s.roll_no LIKE ?
          OR s.email LIKE ?
        )
      `);
      values.push(like, like, like);
    }

    if (invite_status) {
      where.push("eb.invite_status = ?");
      values.push(invite_status);
    }

    if (credentials_status) {
      where.push("eb.credentials_status = ?");
      values.push(credentials_status);
    }

    if (exam_status) {
      where.push("es.exam_status = ?");
      values.push(exam_status);
    }

    const whereSQL = where.join(" AND ");

    /* ---------- TOTAL COUNT ---------- */
    const [countRows]: any = await db.execute(
      `
      SELECT COUNT(*) AS total
      FROM UEAS_exam_batches eb
      JOIN UEAS_batch_students bs ON bs.batch_id = eb.batch_id
      JOIN UEAS_students s ON s.id = bs.student_id
      JOIN UEAS_batches b ON b.id = eb.batch_id
      LEFT JOIN UEAS_exam_students es
        ON es.exam_id = eb.exam_id
       AND es.student_id = s.id
      WHERE ${whereSQL}
      `,
      values
    );

    const total = countRows?.[0]?.total ?? 0;

    /* ---------- FETCH STUDENTS + REAL-TIME MARKS ---------- */
    const [students]: any = await db.execute(
      `
      SELECT
        s.id AS student_id,
        s.name,
        s.email,
        s.mobile,
        s.roll_no,

        b.id AS batch_id,
        b.name AS batch_name,

        COALESCE(es.exam_status, 'not_started') AS exam_status,

        /* 🔥 REAL TIME MARKS */
        COALESCE(SUM(sa.marks_awarded), 0) AS total_marks,

        eb.invite_status,
        eb.credentials_status

      FROM UEAS_exam_batches eb
      JOIN UEAS_batch_students bs ON bs.batch_id = eb.batch_id
      JOIN UEAS_students s ON s.id = bs.student_id
      JOIN UEAS_batches b ON b.id = eb.batch_id

      LEFT JOIN UEAS_exam_students es
        ON es.exam_id = eb.exam_id
       AND es.student_id = s.id

      LEFT JOIN UEAS_student_answers sa
        ON sa.exam_id = eb.exam_id
       AND sa.student_id = s.id

      WHERE ${whereSQL}
      GROUP BY s.id
      ORDER BY s.roll_no ASC
      LIMIT ${limit} OFFSET ${offset}
      `,
      values
    );

    /* ---------- SYNC total_marks INTO UEAS_exam_students ---------- */
    for (const st of students) {
      await db.execute(
        `
        UPDATE UEAS_exam_students
        SET total_marks = ?
        WHERE exam_id = ?
          AND student_id = ?
        `,
        [st.total_marks, exam_id, st.student_id]
      );
    }

    /* ---------- RESPONSE ---------- */
    return NextResponse.json(
      {
        success: true,
        page,
        limit,
        total,
        students,
      },
      { status: 200 }
    );
  } catch (e: any) {
    console.error("❌ Exam Students API Error:", e);
    return NextResponse.json(
      { success: false, error: e?.message || "Server error" },
      { status: 500 }
    );
  }
}
