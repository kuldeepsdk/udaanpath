// lib/emailWorker.ts
import { getDB } from "@/lib/db";
import { sendEmail } from "@/lib/mailer";

export async function processEmailQueue() {
  const db = await getDB();

  const [rows]: any = await db.execute(`
    SELECT *
    FROM UEAS_exam_email_logs
    WHERE status = 'pending'
    ORDER BY created_at
    LIMIT 1
  `);

  if (!rows.length) return;

  const job = rows[0];

  try {
    await sendEmail({
      to: job.email,
      subject: job.subject,
      html: job.html_content,
    });

    await db.execute(`
      UPDATE UEAS_exam_email_logs
      SET status = 'sent', sent_at = NOW()
      WHERE id = ?
    `, [job.id]);

  } catch (err:any) {
    await db.execute(`
      UPDATE UEAS_exam_email_logs
      SET status = 'failed', error = ?
      WHERE id = ?
    `, [err.message, job.id]);
  }

  // 🛑 RATE LIMIT
  await new Promise(r => setTimeout(r, 2500));
}
