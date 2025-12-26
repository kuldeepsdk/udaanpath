import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { validateInternalApi } from "@/lib/apiAuth";

type AnyRow = Record<string, any>;

function asArray(val: any): string[] {
  if (!val) return [];
  if (Array.isArray(val)) return val.map(String);
  try {
    const parsed = JSON.parse(val);
    if (Array.isArray(parsed)) return parsed.map(String);
  } catch {}
  return [];
}

function setsEqual(a: string[], b: string[]) {
  const A = new Set(a);
  const B = new Set(b);
  if (A.size !== B.size) return false;
  for (const x of A) if (!B.has(x)) return false;
  return true;
}

export async function POST(req: Request) {
  const auth = await validateInternalApi(req);
  if (!auth.ok) return auth.response;

  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) {
    return NextResponse.json({ success: false, error: "Missing token" }, { status: 401 });
  }

  let body: AnyRow;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid JSON" }, { status: 400 });
  }

  const { exam_id } = body;
  if (!exam_id) {
    return NextResponse.json({ success: false, error: "exam_id required" }, { status: 400 });
  }

  const db = await getDB();

  // 🔎 org ownership check + exam fetch
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
    return NextResponse.json({ success: false, error: "Exam not found" }, { status: 404 });
  }

  const exam = examRows[0];

  // ✅ Fetch paper total marks (fast)
  const [paperRows]: any = await db.execute(
    `SELECT total_marks FROM UEAS_papers WHERE id = ? LIMIT 1`,
    [exam.paper_id]
  );
  const total_exam_marks = paperRows.length ? Number(paperRows[0].total_marks || 0) : 0;

  // ✅ Get all questions in this paper with their correct option IDs
  const [qRows]: any = await db.execute(
    `
    SELECT q.id, q.question_type, q.marks, q.negative_marks
    FROM UEAS_paper_questions pq
    JOIN UEAS_questions q ON q.id = pq.question_id
    WHERE pq.paper_id = ?
    `,
    [exam.paper_id]
  );

  const questionMeta: Record<
    string,
    { question_type: string; marks: number; negative: number; correctOptions: string[] }
  > = {};

  for (const q of qRows) {
    const [cRows]: any = await db.execute(
      `
      SELECT id
      FROM UEAS_question_options
      WHERE question_id = ? AND is_correct = 1
      ORDER BY option_order
      `,
      [q.id]
    );
    questionMeta[q.id] = {
      question_type: q.question_type,
      marks: Number(q.marks || 0),
      negative: Number(q.negative_marks || 0),
      correctOptions: cRows.map((r: AnyRow) => String(r.id)),
    };
  }

  // ✅ Students to evaluate: submitted only
  const [stuRows]: any = await db.execute(
    `
    SELECT student_id
    FROM UEAS_exam_students
    WHERE exam_id = ? AND status = 'submitted'
    `,
    [exam_id]
  );

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    // Evaluate each student
    for (const s of stuRows) {
      const student_id = s.student_id;

      // Get student's answers for this exam
      const [ansRows]: any = await conn.execute(
        `
        SELECT question_id, selected_options
        FROM UEAS_student_answers
        WHERE exam_id = ? AND student_id = ?
        `,
        [exam_id, student_id]
      );

      const ansMap: Record<string, string[]> = {};
      for (const a of ansRows) {
        ansMap[a.question_id] = asArray(a.selected_options);
      }

      let obtained = 0;

      // Evaluate per question
      for (const qid of Object.keys(questionMeta)) {
        const meta = questionMeta[qid];
        const selected = ansMap[qid] || [];
        const correct = meta.correctOptions;

        let is_correct = 0;
        let marks_awarded = 0;

        if (meta.question_type === "mcq_single") {
          is_correct = selected.length === 1 && selected[0] === correct[0] ? 1 : 0;
        } else {
          // mcq_multi: set equality
          is_correct = setsEqual(selected, correct) ? 1 : 0;
        }

        if (is_correct === 1) {
          marks_awarded = meta.marks;
        } else {
          if (exam.negative_marking === 1) {
            marks_awarded = -Math.abs(meta.negative || 0);
          } else {
            marks_awarded = 0;
          }
        }

        obtained += marks_awarded;

        // Update stored evaluation on answers (optional but useful for per-question analytics)
        await conn.execute(
          `
          UPDATE UEAS_student_answers
          SET is_correct = ?, marks_awarded = ?
          WHERE exam_id = ? AND student_id = ? AND question_id = ?
          `,
          [is_correct, marks_awarded, exam_id, student_id, qid]
        );
      }

      // Clamp (optional): obtained cannot be less than 0 if you want
      // obtained = Math.max(0, obtained);

      const percentage =
        total_exam_marks > 0 ? Number(((obtained / total_exam_marks) * 100).toFixed(2)) : null;

      // Upsert exam result
      await conn.execute(
        `
        INSERT INTO UEAS_exam_results
          (id, exam_id, student_id, total_marks, obtained_marks, percentage)
        VALUES
          (SUBSTRING(UUID(),1,16), ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          total_marks = VALUES(total_marks),
          obtained_marks = VALUES(obtained_marks),
          percentage = VALUES(percentage)
        `,
        [exam_id, student_id, total_exam_marks, obtained, percentage]
      );
    }

    // ✅ Rank calculation (dense rank)
    const [resultRows]: any = await conn.execute(
      `
      SELECT student_id, obtained_marks
      FROM UEAS_exam_results
      WHERE exam_id = ?
      ORDER BY obtained_marks DESC
      `,
      [exam_id]
    );

    let currentRank = 0;
    let lastScore: number | null = null;

    for (let i = 0; i < resultRows.length; i++) {
      const row = resultRows[i];
      const score = Number(row.obtained_marks || 0);

      if (lastScore === null || score !== lastScore) {
        currentRank += 1;
        lastScore = score;
      }

      await conn.execute(
        `
        UPDATE UEAS_exam_results
        SET rank_position = ?
        WHERE exam_id = ? AND student_id = ?
        `,
        [currentRank, exam_id, row.student_id]
      );
    }

    await conn.commit();
  } catch (err) {
    await conn.rollback();
    console.error(err);
    return NextResponse.json(
      { success: false, error: "Result calculation failed" },
      { status: 500 }
    );
  } finally {
    conn.release();
  }

  return NextResponse.json(
    { success: true, message: "Results calculated successfully", exam_id },
    { status: 200 }
  );
}
