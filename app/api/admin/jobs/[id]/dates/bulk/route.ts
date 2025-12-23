import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { validateAdminApi } from "@/lib/apiAuth";
import { deleteCacheByPrefix } from "@/lib/cache";

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> } // ✅ Promise
) {
  try {
    // 🔥 MUST AWAIT (Next.js 16 requirement)
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

    if (body.action !== "delete" && body.action !== "add") {
      return NextResponse.json(
        { success: false, error: "Invalid action" },
        { status: 400 }
      );
    }
    if (body.action === "delete") 
    {
        const ids = Array.isArray(body.ids)
        ? body.ids.map(Number).filter(Number.isInteger)
        : [];

        if (ids.length === 0) {
        return NextResponse.json({ success: true, deleted: 0 });
        }

        const placeholders = ids.map(() => "?").join(",");
        const params = [jobId, ...ids];

        const db = await getDB();

        const [result]: any = await db.execute(
        `
        DELETE FROM job_important_dates
        WHERE job_id = ? AND id IN (${placeholders})
        `,
        params
        );

        deleteCacheByPrefix("jobs:");

        return NextResponse.json({
        success: true,
        deleted: result?.affectedRows ?? 0,
        });
    }

    /* ================= BULK ADD ================= */
    if (body.action === "add") {
    const rawDates = body.dates;

    if (!Array.isArray(rawDates) || rawDates.length === 0) {
        return NextResponse.json(
        { success: false, error: "dates array required" },
        { status: 400 }
        );
    }

    // sanitize + normalize
    const dates = rawDates
        .map((d: any) => ({
        event_key: String(d.event_key || "").trim(),
        event_label: String(d.event_label || "").trim(),
        event_date: d.event_date ? String(d.event_date) : null,
        }))
        .filter(
        (d) => d.event_key.length > 0 && d.event_label.length > 0
        );

    if (dates.length === 0) {
        return NextResponse.json({ success: true, inserted: 0 });
    }

    const values: any[] = [];
    const placeholders = dates
        .map(() => {
        values.push(jobId, null, null, null); // temp
        return "(?, ?, ?, ?)";
        })
        .join(",");

    // rebuild values properly (flat)
    values.length = 0;
    for (const d of dates) {
        values.push(jobId, d.event_key, d.event_label, d.event_date);
    }

    const db = await getDB();

    const [result]: any = await db.execute(
        `
        INSERT INTO job_important_dates
        (job_id, event_key, event_label, event_date)
        VALUES ${placeholders}
        `,
        values
    );

    deleteCacheByPrefix("jobs:");

    return NextResponse.json({
        success: true,
        inserted: result?.affectedRows ?? dates.length,
    });
    }

    
    } catch (err: any) {
        console.error("Bulk delete API error:", err);
        return NextResponse.json(
        { success: false, error: err?.message || "Server error" },
        { status: 500 }
        );
    }
}
