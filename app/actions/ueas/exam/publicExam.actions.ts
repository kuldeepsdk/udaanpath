"use server";

import { serverFetch } from "@/lib/fetcher";

export async function getPublicExamDetailAction(examId: string) {
  if (!examId) {
    throw new Error("examId missing");
  }
  const res = await serverFetch(`/api/ueas/student/exam/details?exam_id=${examId}`, {
      method: "GET",
      headers: {
        "x-internal-token": process.env.INTERNAL_API_TOKEN!,
         "x-exam-token": process.env.EXAM_PUBLIC_TOKEN!,
      },
       cache: "no-store",
    });
    console.log('getPublicExamDetailAction : '+JSON.stringify(res));
    if (!res.ok || !res.data?.success) {
      throw new Error(res.data?.error || "Failed to load batches");
    }
    
    return res.data;
}
