import { getDB } from "@/lib/db";
import crypto from "crypto";
import { sendEmail } from "@/lib/mailer";

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function decryptPassword(enc: string): string {
  const key = Buffer.from(process.env.STUDENT_SECRET_KEY!, "hex");

  const [ivHex, cipherHex] = enc.includes(":")
    ? enc.split(":")
    : [enc.slice(0, 32), enc.slice(32)];

  const iv = Buffer.from(ivHex, "hex");
  const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);

  let out = decipher.update(cipherHex, "hex", "utf8");
  out += decipher.final("utf8");
  return out;
}

function generatePassword() {
  return crypto.randomBytes(4).toString("hex"); // 8 chars
}

function hashPassword(password: string) {
  return crypto.createHash("sha256").update(password).digest("hex");
}


function buildEmail(p: any) {
  const base = process.env.EXAM_BASE_URL!;
  return {
    subject: `🎓 Exam Credentials – ${p.exam_name}`,
    html: `
      <p>Hello <b>${p.name}</b>,</p>
      <p>Exam: <b>${p.exam_name}</b></p>
      <p>Roll No: <b>${p.roll_no}</b></p>
      <p>Password: <b>${p.password}</b></p>
      <p>
        👉 <a href="https://udaanpath.com/ueas/exam/${p.exam_id}">
        Start Exam</a>
      </p>
      <p><b>Do not share credentials.</b></p>
    `,
  };
}

/* 🔥 BACKGROUND WORKER */
export async function startCredentialsWorker({
  examId,
  batchId,
  orgId,
}: {
  examId: string;
  batchId: string;
  orgId: string;
}) {
  const db = await getDB();
  console.log("startCredentialsWorker called ");
  try {
    const [[exam]]: any = await db.execute(
      `SELECT name,exam_date,start_time,end_time FROM UEAS_exams WHERE id=?`,
      [examId]
    );

    const [students]: any = await db.execute(
      `
      SELECT s.id,s.name,s.email,s.roll_no,
            s.password_hash
      FROM UEAS_batch_students bs
      JOIN UEAS_students s ON s.id=bs.student_id
      WHERE bs.batch_id=?
      `,
      [batchId]
    );

    let sent = 0;
    console.log('startCredentialsWorker received Student records from db : '+JSON.stringify(students));
    for (const s of students) {
      try {
        // ✅ Generate new password
        const password = generatePassword();
        const passwordHash = hashPassword(password);

        // ✅ Update DB
        await db.execute(
          `UPDATE UEAS_students SET password_hash=? WHERE id=?`,
          [passwordHash, s.id]
        );

        const mail = buildEmail({
          ...s,
          password,
          exam_name: exam.name,
          exam_id: examId,
        });

        await sendEmail({
          to: s.email,
          subject: mail.subject,
          html: mail.html,
        });

        sent++;
        await sleep(2500);
      } catch (e) {
        console.log("startCredentialsWorker Error:", e);
      }
    }


    await db.execute(
      `
      UPDATE UEAS_exam_batches
      SET credentials_status=?,
          credentials_completed_at=NOW()
      WHERE exam_id=? AND batch_id=?
      `,
      [sent ? "sent" : "failed", examId, batchId]
    );
  } catch {
    await db.execute(
      `
      UPDATE UEAS_exam_batches
      SET credentials_status='failed'
      WHERE exam_id=? AND batch_id=?
      `,
      [examId, batchId]
    );
  }
}
