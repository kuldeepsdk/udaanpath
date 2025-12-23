// app/api/admin/jobs/[id]/vacancy/bulk/route.ts

import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { validateAdminApi } from "@/lib/apiAuth";
import { deleteCacheByPrefix } from "@/lib/cache";

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> } // Next.js 16
) {
  try {
    const { id: jobId } = await context.params;

    if (!jobId) {
      return NextResponse.json(
        { success: false, error: "Missing jobId" },
        { status: 400 }
      );
    }

    const auth = await validateAdminApi(req);
    if (!auth.ok) return auth.response;

    const body = await req.json();
    const db = await getDB();

    /* ================= BULK ADD ================= */
    if (body.action === "add") {
      const raw = body.vacancies;

      if (!Array.isArray(raw) || raw.length === 0) {
        return NextResponse.json({ success: true, inserted: 0 });
      }

      const vacancies = raw
        .map((v: any) => ({
          post_name: String(v.post_name || "").trim(),
          total_posts: Number(v.total_posts),
        }))
        .filter(
          (v) =>
            v.post_name.length > 0 &&
            Number.isInteger(v.total_posts) &&
            v.total_posts > 0
        );

      if (vacancies.length === 0) {
        return NextResponse.json({ success: true, inserted: 0 });
      }

      const values: any[] = [];
      const placeholders = vacancies
        .map(() => "(?, ?, ?)")
        .join(",");

      for (const v of vacancies) {
        values.push(jobId, v.post_name, v.total_posts);
      }

      const [result]: any = await db.execute(
        `
        INSERT INTO job_vacancy_breakup
        (job_id, post_name, total_posts)
        VALUES ${placeholders}
        `,
        values
      );

      deleteCacheByPrefix("jobs:");

      return NextResponse.json({
        success: true,
        inserted: result?.affectedRows ?? vacancies.length,
      });
    }

    /* ================= BULK DELETE ================= */
    if (body.action === "delete") {
      const ids = Array.isArray(body.ids)
        ? body.ids.map(Number).filter(Number.isInteger)
        : [];

      if (ids.length === 0) {
        return NextResponse.json({ success: true, deleted: 0 });
      }

      const placeholders = ids.map(() => "?").join(",");

      const [result]: any = await db.execute(
        `
        DELETE FROM job_vacancy_breakup
        WHERE job_id = ? AND id IN (${placeholders})
        `,
        [jobId, ...ids]
      );

      deleteCacheByPrefix("jobs:");

      return NextResponse.json({
        success: true,
        deleted: result?.affectedRows ?? 0,
      });
    }

    return NextResponse.json(
      { success: false, error: "Invalid action" },
      { status: 400 }
    );
  } catch (err: any) {
    console.error("Vacancy bulk API error:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Server error" },
      { status: 500 }
    );
  }
}
