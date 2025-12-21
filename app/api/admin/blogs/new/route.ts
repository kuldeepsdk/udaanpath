import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { validateAdminApi } from "@/lib/apiAuth";
import { deleteCacheByPrefix } from "@/lib/cache";

import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const auth = await validateAdminApi(req);
    if (!auth.ok) return auth.response;

    const {
      title,
      slug,
      summary,
      content_html,
      image_base64,
      published = 0,
    } = await req.json();

    if (!title || !slug || !content_html) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const db = await getDB();

    const [exists]: any = await db.execute(
      `SELECT id FROM blogapp_post WHERE slug = ? LIMIT 1`,
      [slug]
    );

    if (exists.length) {
      return NextResponse.json(
        { success: false, error: "Slug already exists" },
        { status: 409 }
      );
    }

    //20 digit unique id
    const blogId = crypto.randomBytes(10).toString("hex");

    await db.execute(
      `
      INSERT INTO blogapp_post
      (id, title, slug, summary, content, image_base64, published, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
      `,
      [
        blogId,
        title,
        slug,
        summary || null,
        content_html,
        image_base64 || null,
        published ? 1 : 0,
      ]
    );

    // 🔥 invalidate blog listing cache
    deleteCacheByPrefix("blogs:");

    return NextResponse.json({ success: true, blogId });
  } catch (err) {
    console.error("Create blog failed:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
