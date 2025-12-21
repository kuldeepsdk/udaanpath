"use client";

import { deleteJobAction } from "@/app/actions/admin/jobs.mutate.action";
import { useTransition } from "react";

export default function DeleteJobButton({ jobId }: { jobId: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      disabled={pending}
      onClick={() => {
        if (!confirm("Delete this vacancy permanently?")) return;
        startTransition(() => deleteJobAction(jobId));
      }}
      className="text-red-600 hover:underline disabled:opacity-50"
    >
      Delete
    </button>
  );
}
