"use client";

import { toggleJobStatusAction } from "@/app/actions/admin/jobs.mutate.action";
import { useTransition } from "react";

export default function JobStatusToggle({
  jobId,
  published,
}: {
  jobId: string;
  published: number;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      disabled={pending}
      onClick={() =>
        startTransition(() =>
          toggleJobStatusAction(jobId, published ? 0 : 1)
        )
      }
      className={`px-2 py-1 rounded text-xs font-medium ${
        published
          ? "bg-green-100 text-green-700 hover:bg-green-200"
          : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
      }`}
    >
      {published ? "Published" : "Draft"}
    </button>
  );
}
