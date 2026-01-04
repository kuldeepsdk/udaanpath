import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { validateInternalApi } from "@/lib/apiAuth";

export async function GET(req: Request) {
  console.log("📊 Admin dashboard API hit");

  const auth = await validateInternalApi(req);
  if (!auth.ok) {
    console.log("❌ Internal auth failed");
    return auth.response;
  }

  const adminId = req.headers.get("x-admin-id");
  const adminSession = req.headers.get("x-admin-session");

  console.log("Admin headers:", { adminId, adminSession });

  if (!adminId || !adminSession) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const db = await getDB();

  /* ---------- CONTENT ---------- */
  const [[blogs]]: any = await db.execute(
    `SELECT COUNT(*) c FROM blogapp_post`
  );
  const [[jobs]]: any = await db.execute(
    `SELECT COUNT(*) c FROM job_posts`
  );
 

  /* ---------- UEAS ---------- */
  const [[orgs]]: any = await db.execute(
    `SELECT COUNT(*) c FROM UEAS_organizations`
  );
  const [[activeOrgs]]: any = await db.execute(
    `SELECT COUNT(*) c FROM UEAS_organizations WHERE status = 1`
  );
  const [[exams]]: any = await db.execute(
    `SELECT COUNT(*) c FROM UEAS_exams`
  );
  const [[students]]: any = await db.execute(
    `SELECT COUNT(*) c FROM UEAS_students`
  );

  const [[credits]]: any = await db.execute(`
    SELECT
      COALESCE(SUM(total_credits),0) total,
      COALESCE(SUM(used_credits),0) used
    FROM UEAS_org_exam_wallet
  `);

  /* ---------- TODAY ---------- */
  const [[todayBlogs]]: any = await db.execute(
    `SELECT COUNT(*) c FROM blogapp_post WHERE DATE(created_at)=CURDATE()`
  );
  const [[todayJobs]]: any = await db.execute(
    `SELECT COUNT(*) c FROM job_posts WHERE DATE(created_at)=CURDATE()`
  );
  const [[todayOrgs]]: any = await db.execute(
    `SELECT COUNT(*) c FROM UEAS_organizations WHERE DATE(created_at)=CURDATE()`
  );

  return NextResponse.json({
    success: true,
    stats: {
      blogs: blogs.c,
      jobs: jobs.c,
      orgs: orgs.c,
      activeOrgs: activeOrgs.c,
      exams: exams.c,
      students: students.c,
      credits,
    },
    today: {
      blogs: todayBlogs.c,
      jobs: todayJobs.c,
      orgs: todayOrgs.c,
    },
  });
}
