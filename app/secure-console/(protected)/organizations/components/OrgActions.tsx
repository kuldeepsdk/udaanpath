"use client";

import { updateOrgStatusAction } from "@/app/actions/admin/organization.action";
import { useState, useTransition } from "react";

type OrgStatus = 0 | 1 | 2;

export default function OrgActions({ org }: any) {
  const [status, setStatus] = useState<OrgStatus>(org.status);
  const [isPending, startTransition] = useTransition();

  function updateStatus(nextStatus: OrgStatus) {
    if (nextStatus === status) return;

    const prevStatus = status;

    // ⚡ OPTIMISTIC UPDATE
    setStatus(nextStatus);

    startTransition(async () => {
      try {
        await updateOrgStatusAction(org.id, nextStatus);
      } catch (err) {
        console.error("Org status update failed", err);

        // ❌ ROLLBACK on failure
        setStatus(prevStatus);

        alert("Failed to update organization status");
      }
    });
  }

  return (
    <div className="flex gap-2 justify-end">
      {status !== 1 && (
        <button
          disabled={isPending}
          onClick={() => updateStatus(1)}
          className="text-xs px-3 py-1 bg-green-600 text-white rounded disabled:opacity-50"
        >
          Approve
        </button>
      )}

      {status !== 2 && (
        <button
          disabled={isPending}
          onClick={() => updateStatus(2)}
          className="text-xs px-3 py-1 bg-red-600 text-white rounded disabled:opacity-50"
        >
          Block
        </button>
      )}

      {status !== 0 && (
        <button
          disabled={isPending}
          onClick={() => updateStatus(0)}
          className="text-xs px-3 py-1 bg-gray-600 text-white rounded disabled:opacity-50"
        >
          Unverify
        </button>
      )}
    </div>
  );
}
