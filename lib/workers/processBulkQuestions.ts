import { getDB } from "@/lib/db";
import crypto from "crypto";

export async function processBulkQuestions(bulkId: string) {
  const db = await getDB();

  const [jobs]: any = await db.execute(
    `SELECT * FROM UEAS_question_bulk_uploads WHERE id=? AND status='pending' LIMIT 1`,
    [bulkId]
  );

  if (!jobs.length) {
    console.log("No pending bulk job:", bulkId);
    return;
  }

  const job = jobs[0];

  await db.execute(
    `UPDATE UEAS_question_bulk_uploads SET status='processing' WHERE id=?`,
    [bulkId]
  );

  const rows = JSON.parse(job.payload);
  let processed = 0;

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];

    try {
      const questionId = crypto.randomUUID().slice(0, 16);

      // Insert Question
      await db.execute(
        `
        INSERT INTO UEAS_questions
        (id, org_id, question_text, question_type, marks, negative_marks,
         difficulty, subject, topic, question_analysis, tags,
         estimated_time_sec, source, reference_link, language, is_published)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          questionId,
          job.org_id,
          row.question_text,
          row.question_type,
          row.marks ?? 1,
          row.negative_marks ?? 0,
          row.difficulty ?? "medium",
          row.subject ?? null,
          row.topic ?? null,
          row.analysis ?? null,
          row.tags ? JSON.stringify(row.tags) : null,
          row.estimated_time_sec ?? null,
          row.source ?? "custom",
          row.reference_link ?? null,
          row.language ?? "en",
          1,
        ]
      );

      // Insert Options
      for (let j = 0; j < row.options.length; j++) {
        const opt = row.options[j];
        await db.execute(
          `
          INSERT INTO UEAS_question_options
          (id, question_id, option_text, is_correct, option_order)
          VALUES (?, ?, ?, ?, ?)
          `,
          [
            crypto.randomUUID().slice(0, 16),
            questionId,
            opt.text,
            opt.is_correct ? 1 : 0,
            j + 1,
          ]
        );
      }

      processed++;

      await db.execute(
        `UPDATE UEAS_question_bulk_uploads SET processed_questions=? WHERE id=?`,
        [processed, bulkId]
      );

    } catch (err: any) {
      console.error("Bulk row failed:", err.message);
      await db.execute(
        `
        INSERT INTO UEAS_question_bulk_errors
        (bulk_id, row_number, error)
        VALUES (?, ?, ?)
        `,
        [bulkId, i + 1, err.message]
      );
    }
  }

  await db.execute(
    `UPDATE UEAS_question_bulk_uploads SET status='completed' WHERE id=?`,
    [bulkId]
  );

  console.log("Bulk processing completed:", bulkId);
}
