// app/api/admin/jobs/[id]/route.ts
import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { validateAdminApi } from "@/lib/apiAuth";
import { deleteCacheByPrefix } from "@/lib/cache";
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const auth = await validateAdminApi(req);
  if (!auth.ok) return auth.response;

  const db = await getDB();

  // Main job
  const [[job]]: any = await db.execute(
    `SELECT * FROM job_posts WHERE id = ? LIMIT 1`,
    [id]
  );

  if (!job) {
    return NextResponse.json(
      { success: false, error: "Job not found" },
      { status: 404 }
    );
  }

  // Related data
  const [dates]: any = await db.execute(
    `SELECT * FROM job_important_dates WHERE job_id = ? ORDER BY event_date`,
    [id]
  );

  const [links]: any = await db.execute(
    `SELECT * FROM job_links WHERE job_id = ?`,
    [id]
  );

  const [vacancy]: any = await db.execute(
    `SELECT * FROM job_vacancy_breakup WHERE job_id = ?`,
    [id]
  );

  return NextResponse.json({
    success: true,
    job,
    dates,
    links,
    vacancy,
  });
}




export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const auth = await validateAdminApi(req);
  if (!auth.ok) return auth.response;

  const body = await req.json();

  const {
    title,
    slug,
    category,
    organization,
    department,
    summary,
    full_description,
    total_posts,
    salary,
    qualification,
    age_limit,
    application_fee,
    selection_process,
    official_website,
    apply_link,
    notification_image_base64,
    status,
    published,
  } = body;

  if (!title || !slug || !category) {
    return NextResponse.json(
      { success: false, error: "Missing required fields" },
      { status: 400 }
    );
  }

  const db = await getDB();

  await db.execute(
    `
    UPDATE job_posts SET
      title = ?,
      slug = ?,
      category = ?,
      organization = ?,
      department = ?,
      summary = ?,
      full_description = ?,
      total_posts = ?,
      salary = ?,
      qualification = ?,
      age_limit = ?,
      application_fee = ?,
      selection_process = ?,
      official_website = ?,
      apply_link = ?,
      notification_image_base64 = ?,
      status = ?,
      published = ?,
      updated_at = NOW()
    WHERE id = ?
    `,
    [
      title,
      slug,
      category,
      organization || null,
      department || null,
      summary || null,
      full_description || null,
      total_posts || null,
      salary || null,
      qualification || null,
      age_limit || null,
      application_fee || null,
      selection_process || null,
      official_website || null,
      apply_link || null,
      notification_image_base64 || null,
      status || "draft",
      published ? 1 : 0,
      id,
    ]
  );

  deleteCacheByPrefix("jobs:");

  return NextResponse.json({ success: true });
}


export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const auth = await validateAdminApi(req);
  if (!auth.ok) return auth.response;

  const db = await getDB();

  const [result]: any = await db.execute(
    `DELETE FROM job_posts WHERE id = ?`,
    [id]
  );

  if (result.affectedRows === 0) {
    return NextResponse.json(
      { success: false, error: "Job not found" },
      { status: 404 }
    );
  }

  deleteCacheByPrefix("jobs:");

  return NextResponse.json({ success: true });
}
