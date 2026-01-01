"use server";

import { cookies } from "next/headers";
import { serverFetch } from "@/lib/fetcher";

export async function getStudentExamAnalysisAction(payload: {
  exam_id: string;
  roll_no: string;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("ueas_org_token")?.value;

  if (!token) {
    throw new Error("Organization session missing");
  }

  const res = await serverFetch(
    `/api/ueas/exams/student-analysis?exam_id=${payload.exam_id}&roll_no=${payload.roll_no}`,
    {
      method: "GET",
      headers: {
        "x-internal-token": process.env.INTERNAL_API_TOKEN!,
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );
  console.log('getStudentExamAnalysisAction response : '+JSON.stringify(res));
  if (!res.ok || !res.data?.success) {
    throw new Error(res.data?.error || "Failed to load analysis");
  }

  return res.data;
}
