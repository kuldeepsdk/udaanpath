"use client";

import { useState } from "react";
import AssignCreditsModal from "./AssignCreditsModal";
import { getOrganizationDetailAction } from "@/app/actions/admin/organization.action";

/* ---------------- UI HELPERS ---------------- */

function StatusBadge({ status }: { status: number }) {
  if (status === 1)
    return <span className="px-3 py-1 rounded-full text-xs bg-green-100 text-green-700">Approved</span>;
  if (status === 2)
    return <span className="px-3 py-1 rounded-full text-xs bg-red-100 text-red-700">Blocked</span>;
  return <span className="px-3 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700">Unverified</span>;
}

function InfoRow({ label, value }: any) {
  return (
    <div className="flex justify-between py-1 border-b last:border-0">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function CreditBox({
  label,
  value,
  highlight,
}: {
  label: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <div
      className={`p-3 rounded-lg border ${
        highlight ? "bg-green-50 border-green-200" : "bg-slate-50"
      }`}
    >
      <div className="text-xs text-slate-500">{label}</div>
      <div className="text-xl font-bold">{value}</div>
    </div>
  );
}

/* ---------------- MAIN COMPONENT ---------------- */

export default function OrganizationDetailClient({
  orgId,
  initialData,
}: {
  orgId: string;
  initialData: any;
}) {
  const [data, setData] = useState(initialData);
  const [openCredits, setOpenCredits] = useState(false);

  async function reload() {
    const fresh = await getOrganizationDetailAction(orgId);
    setData(fresh);
  }

  const { organization: org, credits } = data;

  return (
    <div className="space-y-6">

      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">
            {org.name}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Org ID: <span className="font-mono">{org.id}</span>
          </p>
        </div>

        <StatusBadge status={org.status} />
      </div>

      {/* ================= INFO + CREDITS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* ORG INFO */}
        <div className="bg-white border rounded-xl p-5">
          <h3 className="text-sm font-semibold mb-4">
            Organization Details
          </h3>

          <InfoRow label="Email" value={org.email} />
          <InfoRow label="Mobile" value={org.mobile || "-"} />
          <InfoRow label="City" value={org.city || "-"} />
          <InfoRow label="Created On" value={org.created_at} />
        </div>

        {/* CREDITS */}
        <div className="bg-white border rounded-xl p-5">
          <h3 className="text-sm font-semibold mb-4">
            Exam Credits
          </h3>

          <div className="grid grid-cols-3 gap-4 text-center">
            <CreditBox label="Total" value={credits.total} />
            <CreditBox label="Used" value={credits.used} />
            <CreditBox
              label="Remaining"
              value={credits.remaining}
              highlight
            />
          </div>

          <div className="mt-5 text-right">
            <button
              onClick={() => setOpenCredits(true)}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm"
            >
              + Assign Credits
            </button>
          </div>
        </div>
      </div>

      {/* ================= MODAL ================= */}
      <AssignCreditsModal
        open={openCredits}
        orgId={orgId}
        onClose={() => setOpenCredits(false)}
        onAssigned={reload}
      />
    </div>
  );
}
