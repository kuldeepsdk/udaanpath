import {
  fetchSourceAlerts,
  runSourceMonitor,
  getMonitorStatus,
} from "@/app/actions/admin/sourceMonitor.action";

export default async function SourceAlertsPage() {
  // 1️⃣ Load alerts
  const alertsResp = await fetchSourceAlerts();
  const alerts = alertsResp?.data ?? [];

  // 2️⃣ Load current monitor run status
  const statusResp = await getMonitorStatus();
  const run = statusResp?.run;

  const isRunning = run?.status === "running";

  return (
    <div className="space-y-6">
      {/* ================= Header ================= */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">
            Source Alerts
          </h1>
          <p className="text-sm text-slate-500">
            Manual monitoring of official job sources
          </p>
        </div>

        {/* 🔘 Run Monitoring Button (NON-BLOCKING) */}
        <form
          action={async () => {
            "use server";
            await runSourceMonitor();
          }}
        >
          <button
            disabled={isRunning}
            className={`px-4 py-2 rounded-lg text-sm font-medium text-white transition ${
              isRunning
                ? "bg-slate-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isRunning ? "Monitoring Running…" : "Run Monitoring"}
          </button>
        </form>
      </div>

      {/* ================= Run Status ================= */}
      {run && (
        <div className="flex flex-wrap gap-4 text-sm text-slate-600">
          <span>
            Status:{" "}
            <b
              className={
                run.status === "running"
                  ? "text-amber-600"
                  : run.status === "completed"
                  ? "text-emerald-600"
                  : run.status === "failed"
                  ? "text-red-600"
                  : ""
              }
            >
              {run.status}
            </b>
          </span>

          {run.started_at && (
            <span>
              Started:{" "}
              {new Date(run.started_at).toLocaleString()}
            </span>
          )}

          {run.finished_at && (
            <span>
              Finished:{" "}
              {new Date(run.finished_at).toLocaleString()}
            </span>
          )}

          {typeof run.alerts_created === "number" && (
            <span>
              Alerts: <b>{run.alerts_created}</b>
            </span>
          )}
        </div>
      )}

      {/* ================= Alerts Table ================= */}
      <div className="bg-white border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="p-3 text-left">Source</th>
              <th className="p-3 text-left">Type</th>
              <th className="p-3 text-left">Message</th>
              <th className="p-3 text-left">Detected</th>
            </tr>
          </thead>

          <tbody>
            {alerts.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="p-6 text-center text-slate-500"
                >
                  No alerts found
                </td>
              </tr>
            )}

            {alerts.map((a: any) => (
              <tr key={a.id} className="border-t">
                <td className="p-3 font-medium">
                  {a.source_name}
                </td>

                <td className="p-3">
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-medium ${
                      a.alert_type === "content_changed"
                        ? "bg-amber-100 text-amber-700"
                        : a.alert_type === "error"
                        ? "bg-red-100 text-red-700"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {a.alert_type}
                  </span>
                </td>

                <td className="p-3">{a.message}</td>

                <td className="p-3 text-xs text-slate-500">
                  {new Date(a.detected_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
