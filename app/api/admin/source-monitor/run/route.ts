import { NextResponse } from "next/server";
import { validateAdminApi } from "@/lib/apiAuth";
import { getDB } from "@/lib/db";
import crypto from "crypto";

export async function POST(req: Request) {
  const auth = await validateAdminApi(req);
  if (!auth.ok) return auth.response;

  const db = await getDB();

  // 🔒 Prevent parallel runs
  const [active]: any = await db.execute(`
    SELECT id FROM source_monitor_runs
    WHERE status = 'running'
    LIMIT 1
  `);

  if (active.length) {
    return NextResponse.json({
      success: true,
      status: "already_running",
    });
  }

  // Create run record
  const [runResult]: any = await db.execute(`
    INSERT INTO source_monitor_runs (status, started_at)
    VALUES ('running', NOW())
  `);

  const runId = runResult.insertId;

  // 🚀 Fire-and-forget async task
  runMonitorAsync(runId).catch(console.error);

  return NextResponse.json({
    success: true,
    status: "started",
    run_id: runId,
  });
}

/* ================= ASYNC WORKER ================= */

async function runMonitorAsync(runId: number) {
  const db = await getDB();

  try {
    const [sources]: any = await db.execute(`
      SELECT id, name, base_url, last_hash
      FROM job_sources
      WHERE is_active = 1
      LIMIT 50
    `);

    let alertsCreated = 0;

    for (const src of sources) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000); // ⏱️ 15s timeout

      try {
        const res = await fetch(src.base_url, {
          headers: { "user-agent": "UdaanPath-Monitor/1.0" },
          signal: controller.signal,
        });

        clearTimeout(timeout);

        const httpStatus = res.status;
        const text = await res.text();
        const snippet = text.slice(0, 4000);

        const hash = crypto
          .createHash("sha256")
          .update(snippet)
          .digest("hex");

        if (src.last_hash && src.last_hash !== hash) {
          await db.execute(
            `
            INSERT INTO source_alerts
            (source_id, source_name, alert_type, message)
            VALUES (?, ?, 'content_changed', ?)
          `,
            [src.id, src.name, `Content changed on ${src.name}`]
          );
          alertsCreated++;
        }

        await db.execute(
          `
          UPDATE job_sources
          SET last_hash = ?, last_checked_at = NOW(), last_http_status = ?
          WHERE id = ?
        `,
          [hash, httpStatus, src.id]
        );
      } catch (err: any) {
        clearTimeout(timeout);

        await db.execute(
          `
          INSERT INTO source_alerts
          (source_id, source_name, alert_type, message)
          VALUES (?, ?, 'error', ?)
        `,
          [src.id, src.name, err.message || "Fetch error"]
        );

        await db.execute(
          `
          UPDATE job_sources
          SET last_checked_at = NOW(), last_http_status = NULL
          WHERE id = ?
        `,
          [src.id]
        );
      }
    }

    await db.execute(
      `
      UPDATE source_monitor_runs
      SET status = 'completed',
          finished_at = NOW(),
          total_sources = ?,
          alerts_created = ?
      WHERE id = ?
    `,
      [sources.length, alertsCreated, runId]
    );
  } catch (err: any) {
    await db.execute(
      `
      UPDATE source_monitor_runs
      SET status = 'failed',
          finished_at = NOW(),
          error_message = ?
      WHERE id = ?
    `,
      [err.message, runId]
    );
  }
}
