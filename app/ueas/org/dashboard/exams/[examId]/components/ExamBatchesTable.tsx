"use client";

export default function ExamBatchesTable({
  batches,
  onSendInvite,
  onSendCredentials,
}: {
  batches: any[];
  onSendInvite: (batchId: string) => Promise<void>;
  onSendCredentials: (batchId: string) => Promise<void>;
}) {
  if (!batches || batches.length === 0) {
    return (
      <div className="bg-white border rounded-xl p-6 text-sm text-slate-500">
        No batches assigned to this exam yet
      </div>
    );
  }

  async function confirmAndRun(
    message: string,
    action: () => Promise<void>
  ) {
    if (!confirm(message)) return;
    await action();
  }

  return (
    <div className="bg-white border rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b font-semibold text-sm">
        Assigned Batches
      </div>

      <table className="w-full text-sm">
        <thead className="bg-slate-50 border-b">
          <tr>
            <th className="px-4 py-3 text-left">Batch</th>
            <th className="px-4 py-3 text-center">Invite</th>
            <th className="px-4 py-3 text-center">Credentials</th>
            <th className="px-4 py-3 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {batches.map((b) => {
            const inviteStatus = b.invite_status; // pending | processing | sent | failed
            const credStatus = b.credentials_status;

            const canSendInvite =
              inviteStatus === "pending" || inviteStatus === "failed";

            const canSendCreds =
              inviteStatus === "sent" &&
              (credStatus === "pending" || credStatus === "failed");

            return (
              <tr
                key={b.id}
                className="border-b last:border-b-0 hover:bg-slate-50"
              >
                {/* Batch */}
                <td className="px-4 py-3 font-medium">{b.name}</td>

                {/* Invite Status */}
                <td className="px-4 py-3 text-center">
                  <StatusBadge status={inviteStatus} />
                </td>

                {/* Credentials Status */}
                <td className="px-4 py-3 text-center">
                  <StatusBadge status={credStatus} />
                </td>

                {/* Actions */}
                <td className="px-4 py-3 text-center">
                  <div className="flex justify-center gap-2">

                    {/* SEND INVITE */}
                    <button
                      onClick={() =>
                        confirmAndRun(
                          `Send exam invitation to "${b.name}"?`,
                          () => onSendInvite(b.id)
                        )
                      }
                      disabled={!canSendInvite || inviteStatus === "processing"}
                      className={buttonClass(inviteStatus, "primary")}
                    >
                      {inviteStatus === "processing"
                        ? "Sending…"
                        : inviteStatus === "failed"
                        ? "Retry Invite"
                        : "📧 Invite"}
                    </button>

                    {/* SEND CREDENTIALS */}
                    <button
                      onClick={() =>
                        confirmAndRun(
                          `Send login credentials to "${b.name}"?`,
                          () => onSendCredentials(b.id)
                        )
                      }
                      disabled={!canSendCreds || credStatus === "processing"}
                      className={buttonClass(credStatus, "secondary")}
                    >
                      {credStatus === "processing"
                        ? "Sending…"
                        : credStatus === "failed"
                        ? "Retry Creds"
                        : "🔐 Credentials"}
                    </button>

                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ---------- Status Badge ---------- */
function StatusBadge({
  status,
}: {
  status: "pending" | "processing" | "sent" | "failed";
}) {
  const map: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    processing: "bg-blue-100 text-blue-700",
    sent: "bg-green-100 text-green-700",
    failed: "bg-red-100 text-red-700",
  };

  const label =
    status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <span
      className={`inline-flex items-center rounded-full
                  px-2.5 py-0.5 text-xs font-medium ${map[status]}`}
    >
      {label}
    </span>
  );
}

/* ---------- Button Styles ---------- */
function buttonClass(
  status: string,
  type: "primary" | "secondary"
) {
  if (status === "processing" || status === "sent") {
    return "px-3 py-1.5 rounded text-xs bg-slate-200 text-slate-500 cursor-not-allowed";
  }

  if (type === "primary") {
    return "px-3 py-1.5 rounded text-xs bg-blue-600 text-white hover:bg-blue-700";
  }

  return "px-3 py-1.5 rounded text-xs bg-emerald-600 text-white hover:bg-emerald-700";
}
