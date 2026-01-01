import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import crypto from "crypto";
import { validateStudentExamApi } from "@/lib/apiAuth";

/* =========================================================
   IST SAFE TIME UTILITIES
   ========================================================= */

function verifyPassword(
  plainPassword: string,
  storedHash: string,
): boolean {
  if (!plainPassword || !storedHash) {
    return false;
  }

  const hash = crypto
    .createHash("sha256")
    .update(plainPassword)
    .digest("hex");

  return hash === storedHash;
}
/**
 * Combines exam_date (DATE) + time (TIME) and
 * forces IST (+05:30) regardless of server timezone
 */
function combineDateTimeIST(dateInput: any, time: string): Date {
  let dateStr: string;

  if (dateInput instanceof Date) {
    // 👇 Extract IST calendar date safely
    const y = dateInput.getFullYear();
    const m = String(dateInput.getMonth() + 1).padStart(2, "0");
    const d = String(dateInput.getDate()).padStart(2, "0");
    dateStr = `${y}-${m}-${d}`;
  } else {
    // 👇 Already string like "2025-12-30"
    dateStr = String(dateInput).slice(0, 10);
  }

  // 👇 Force IST explicitly
  return new Date(`${dateStr}T${time}+05:30`);
}


/* =========================================================
   PASSWORD DECRYPT
   ========================================================= */

/* =========================================================
   API
   ========================================================= */

export async function POST(req: Request) {
  try {
    /* ---------- INTERNAL AUTH ---------- */
    const auth = await validateStudentExamApi(req);
    if (!auth.ok) return auth.response;

    const body = await req.json();
    const { exam_id, roll_no, password } = body || {};

    if (!exam_id || !roll_no || !password) {
      return NextResponse.json(
        { success: false, error: "exam_id, roll_no and password required" },
        { status: 400 }
      );
    }

    const db = await getDB();

    /* ---------- EXAM ---------- */
    const [examRows]: any = await db.execute(
      `
      SELECT id, exam_date, start_time, end_time, status
      FROM UEAS_exams
      WHERE id = ?
      LIMIT 1
      `,
      [exam_id]
    );

    if (!examRows.length) {
      return NextResponse.json(
        { success: false, error: "Invalid exam" },
        { status: 404 }
      );
    }

    const exam = examRows[0];

    /* ---------- TIME CALCULATION (GLOBAL SAFE) ---------- */
    const now = new Date(); // absolute current instant (safe everywhere)
    console.log("exam.exam_date : "+exam.exam_date+ "  exam.start_time : "+ exam.start_time);
    const examStart = combineDateTimeIST(exam.exam_date, exam.start_time);
    const examEnd   = combineDateTimeIST(exam.exam_date, exam.end_time);

    const loginOpen  = new Date(examStart.getTime() - 10 * 60 * 1000);
    const loginClose = new Date(examStart.getTime() + 10 * 60 * 1000);
    /*
    if (now < loginOpen) {
      return NextResponse.json(
        { success: false, error: "Exam login not started yet" },
        { status: 403 }
      );
    }

    if (now > loginClose) {
      return NextResponse.json(
        {
          success: false,
          error: "Login window closed",
          meta: {
            now_ist: now.toLocaleString("en-IN", {
              timeZone: "Asia/Kolkata",
            }),
            login_open_ist: loginOpen.toLocaleString("en-IN", {
              timeZone: "Asia/Kolkata",
            }),
            login_close_ist: loginClose.toLocaleString("en-IN", {
              timeZone: "Asia/Kolkata",
            }),
            exam_start_ist: examStart.toLocaleString("en-IN", {
              timeZone: "Asia/Kolkata",
            }),
            exam_end_ist: examEnd.toLocaleString("en-IN", {
              timeZone: "Asia/Kolkata",
            }),
          },
        },
        { status: 403 }
      );
    }
    */

    /* ---------- STUDENT ---------- */
    const [studentRows]: any = await db.execute(
      `
      SELECT s.id, s.password_hash
      FROM UEAS_students s
      WHERE s.roll_no = ?
      LIMIT 1
      `,
      [roll_no]
    );

    if (!studentRows.length) {
      return NextResponse.json(
        { success: false, error: "Invalid roll number" },
        { status: 401 }
      );
    }

    const student = studentRows[0];

    if (!student.password_hash || typeof student.password_hash !== "string") {
      return NextResponse.json(
        {
          success: false,
          error: "Password not set for this student. Contact exam admin.",
        },
        { status: 403 }
      );
    }


    console.log("student : "+JSON.stringify(student));
    
    const isValid = verifyPassword(
      password,
      student.password_hash,
    );

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 }
      );
    }



    

    /* ---------- EXAM STUDENT ---------- */
    const [esRows]: any = await db.execute(
      `
      SELECT id, exam_status
      FROM UEAS_exam_students
      WHERE exam_id = ? AND student_id = ?
      LIMIT 1
      `,
      [exam_id, student.id]
    );

    if (esRows.length && esRows[0].exam_status === "completed") {
      return NextResponse.json(
        { success: false, error: "Exam already completed" },
        { status: 403 }
      );
    }

    /* ---------- CREATE SESSION ---------- */
    const sessionToken = crypto.randomUUID();

    await db.execute(
      `
      INSERT INTO UEAS_exam_sessions
      (id, exam_id, student_id, session_token, created_at)
      VALUES (?, ?, ?, ?, NOW())
      `,
      [crypto.randomUUID(), exam_id, student.id, sessionToken]
    );

    return NextResponse.json(
      {
        success: true,
        message: "Login successful",
        session_token: sessionToken,
        redirect: `/exam/${exam_id}/attempt`,
      },
      { status: 200 }
    );
  } catch (e: any) {
    console.error("❌ Student Login Error:", e);
    return NextResponse.json(
      { success: false, error: e?.message || "Server error" },
      { status: 500 }
    );
  }
}
