"use server";

import { serverFetch } from "@/lib/fetcher";

export async function getStudentExamSummaryAction(payload: {
  exam_id: string;
  token: string;
}) {
  const url =
    `/api/ueas/student/exam/summary?exam_id=${encodeURIComponent(
      payload.exam_id
    )}`;

  const res = await serverFetch(url, {
    method: "GET",
    headers: {
      "x-internal-token": process.env.INTERNAL_API_TOKEN!,
      Authorization: `Bearer ${payload.token}`,
    },
    cache: "no-store",
  });

  if (!res.ok || !res.data?.success) {
    throw new Error(res.data?.error || "Failed to fetch exam summary");
  }

  return res.data.summary;
}
