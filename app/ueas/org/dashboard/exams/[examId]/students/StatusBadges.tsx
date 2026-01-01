"use client";

export function StatusBadge({
  value,
  type,
}: {
  value: string;
  type: "exam" | "invite" | "credentials";
}) {
  let label = value;
  let color = "bg-slate-100 text-slate-700";

  /* -------- INVITE / CREDENTIALS -------- */
  if (type === "invite" || type === "credentials") {
    switch (value) {
      case "sent":
        color = "bg-green-100 text-green-700";
        label = "Sent";
        break;
      case "processing":
        color = "bg-blue-100 text-blue-700";
        label = "Processing";
        break;
      case "failed":
        color = "bg-red-100 text-red-700";
        label = "Failed";
        break;
      default:
        color = "bg-yellow-100 text-yellow-700";
        label = "Pending";
    }
  }

  /* -------- EXAM STATUS -------- */
  if (type === "exam") {
    switch (value) {
      case "started":
        color = "bg-blue-100 text-blue-700";
        label = "Started";
        break;
      case "completed":
        color = "bg-green-100 text-green-700";
        label = "Completed";
        break;
      case "suspended":
        color = "bg-red-100 text-red-700";
        label = "Suspended";
        break;
      default:
        color = "bg-slate-100 text-slate-700";
        label = "Not Started";
    }
  }

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5
                  text-xs font-medium ${color}`}
    >
      {label}
    </span>
  );
}
