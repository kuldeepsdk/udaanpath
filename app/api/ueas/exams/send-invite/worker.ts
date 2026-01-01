import { getDB } from "@/lib/db";
import crypto from "crypto";
import { sendEmail } from "@/lib/mailer";

const MAIL_DELAY_MS = 4000; // 🔥 Zoho-safe (15 mails/min approx)

function sleep(ms: number) {
  return new Promise(res => setTimeout(res, ms));
}

function buildInviteEmail(payload: {
  name: string;
  exam_name: string;
  exam_date: string;
  start_time: string;
  end_time: string;
}) {
  const subject = `🎓 Exam Invitation – ${payload.exam_name}`;

  const html = `
  <div style="font-family: Arial, Helvetica, sans-serif; background:#f4f6f8; padding:24px;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0"
                 style="background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.08);">

            <!-- HEADER -->
            <tr>
              <td style="background:#2563eb; padding:18px 24px; color:#ffffff;">
                <h2 style="margin:0; font-size:20px;">UdaanPath Examination Portal</h2>
              </td>
            </tr>

            <!-- BODY -->
            <tr>
              <td style="padding:24px; color:#333333;">
                <p style="font-size:14px;">Dear <b>${payload.name}</b>,</p>

                <p style="font-size:14px; line-height:1.6;">
                  You are formally invited to appear in the following examination
                  scheduled by your organization.
                </p>

                <table cellpadding="8" cellspacing="0"
                       style="margin:16px 0; border-collapse:collapse; width:100%; font-size:14px;">
                  <tr style="background:#f1f5f9;">
                    <td style="border:1px solid #e5e7eb;"><b>Examination Name</b></td>
                    <td style="border:1px solid #e5e7eb;">${payload.exam_name}</td>
                  </tr>
                  <tr>
                    <td style="border:1px solid #e5e7eb;"><b>Date</b></td>
                    <td style="border:1px solid #e5e7eb;">${payload.exam_date}</td>
                  </tr>
                  <tr style="background:#f1f5f9;">
                    <td style="border:1px solid #e5e7eb;"><b>Time</b></td>
                    <td style="border:1px solid #e5e7eb;">
                      ${payload.start_time} – ${payload.end_time}
                    </td>
                  </tr>
                </table>

                <p style="font-size:14px; line-height:1.6;">
                  🔐 Your <b>Roll Number</b> and <b>Password</b> will be shared
                  in a separate email before the examination.
                </p>

                <p style="font-size:14px; line-height:1.6;">
                  ⏰ Please ensure you are available at least
                  <b>15 minutes before the scheduled start time</b>.
                </p>

                <p style="font-size:14px; margin-top:24px;">
                  Best wishes for your examination.
                </p>

                <p style="font-size:14px;">
                  Regards,<br/>
                  <b>UdaanPath Examination Team</b>
                </p>
              </td>
            </tr>

            <!-- FOOTER -->
            <tr>
              <td style="background:#f8fafc; padding:14px 24px; font-size:12px; color:#6b7280;">
                This is a system-generated email. Please do not reply.
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </div>
  `;

  return { subject, html };
}


/* 🔥 BACKGROUND JOB */
export async function startInviteWorker({
  exam_id,
  batch_id,
  org_id,
}: {
  exam_id: string;
  batch_id: string;
  org_id: string;
}) {
  (async () => {
    const db = await getDB();

    try {
      /* 📄 LOAD EXAM */
      const [[exam]]: any = await db.execute(
        `
        SELECT name, exam_date, start_time, end_time
        FROM UEAS_exams
        WHERE id = ? AND org_id = ?
        `,
        [exam_id, org_id]
      );

      /* 👨‍🎓 LOAD STUDENTS */
      const [students]: any = await db.execute(
        `
        SELECT s.id, s.name, s.email
        FROM UEAS_batch_students bs
        JOIN UEAS_students s ON s.id = bs.student_id
        WHERE bs.batch_id = ?
        `,
        [batch_id]
      );

      let sent = 0;
      let failed = 0;

      for (const s of students) {
        if (!s.email) continue;

        const mail = buildInviteEmail({
          name: s.name,
          exam_name: exam.name,
          exam_date: exam.exam_date,
          start_time: exam.start_time,
          end_time: exam.end_time,
        });

        try {
          await sendEmail({
            to: s.email,
            subject: mail.subject,
            html: mail.html,
          });

          await db.execute(
            `
            INSERT INTO UEAS_exam_email_logs
            (id, exam_id, batch_id, student_id,
             email_type, email, subject, html_content, status)
            VALUES (?, ?, ?, ?, 'invite', ?, ?, ?, 'sent')
            `,
            [
              crypto.randomUUID().slice(0, 16),
              exam_id,
              batch_id,
              s.id,
              s.email,
              mail.subject,
              mail.html,
            ]
          );

          sent++;
        } catch (err: any) {
          failed++;

          await db.execute(
            `
            INSERT INTO UEAS_exam_email_logs
            (id, exam_id, batch_id, student_id,
             email_type, email, status, error)
            VALUES (?, ?, ?, ?, 'invite', ?, 'failed', ?)
            `,
            [
              crypto.randomUUID().slice(0, 16),
              exam_id,
              batch_id,
              s.id,
              s.email,
              err?.message || "Send failed",
            ]
          );
        }

        await sleep(MAIL_DELAY_MS); // 🕒 RATE LIMIT SAFE
      }

      /* ✅ FINAL STATUS */
      await db.execute(
        `
        UPDATE UEAS_exam_batches
        SET invite_status = ?,
            invite_completed_at = NOW()
        WHERE exam_id = ? AND batch_id = ?
        `,
        [failed > 0 ? "failed" : "sent", exam_id, batch_id]
      );
    } catch (e) {
      await db.execute(
        `
        UPDATE UEAS_exam_batches
        SET invite_status = 'failed'
        WHERE exam_id = ? AND batch_id = ?
        `,
        [exam_id, batch_id]
      );
    }
  })();
}
