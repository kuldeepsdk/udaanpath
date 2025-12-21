import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { validateAdminApi } from "@/lib/apiAuth";
import crypto from "crypto";
import { deleteCacheByPrefix } from "@/lib/cache";

export async function POST(req: Request) {
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
    published = 1,
  } = body;

  if (!title || !slug || !category) {
    return NextResponse.json(
      { success: false, error: "Missing required fields" },
      { status: 400 }
    );
  }

  const db = await getDB();

  // Slug uniqueness
  const [exists]: any = await db.execute(
    "SELECT id FROM job_posts WHERE slug = ? LIMIT 1",
    [slug]
  );

  if (exists.length) {
    return NextResponse.json(
      { success: false, error: "Slug already exists" },
      { status: 409 }
    );
  }

  const jobId = crypto.randomBytes(10).toString("hex");

  await db.execute(
    `
    INSERT INTO job_posts (
      id, title, slug, category, organization, department,
      summary, full_description, total_posts, salary,
      qualification, age_limit, application_fee, selection_process,
      official_website, apply_link, notification_image_base64,
      published, created_at
    ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,NOW())
    `,
    [
      jobId,
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
      published ? 1 : 0,
    ]
  );

  // 🔥 clear public cache
  deleteCacheByPrefix("jobs:");

  return NextResponse.json({
    success: true,
    jobId,
  });
}

// Get jobs listing 


export async function GET(req: Request) {
  const auth = await validateAdminApi(req);
  if (!auth.ok) return auth.response;

  const url = new URL(req.url);

  const page = Math.max(Number(url.searchParams.get("page") || 1), 1);
  const limit = Math.min(Number(url.searchParams.get("limit") || 10), 50);
  const offset = (page - 1) * limit;

  const db = await getDB();

  /* total count → execute is OK */
  const [[{ total }]]: any = await db.execute(
    "SELECT COUNT(*) AS total FROM job_posts"
  );

  /* ✅ IMPORTANT: use query(), not execute() */
  const [rows]: any = await db.query(
    `
    SELECT id, title, category, published, created_at
    FROM job_posts
    ORDER BY created_at DESC
    LIMIT ${offset}, ${limit}
    `
  );

  return NextResponse.json({
    success: true,
    data: rows,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}
