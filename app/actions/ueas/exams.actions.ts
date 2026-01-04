"use server";

import { serverFetch } from "@/lib/fetcher";
import { cookies } from "next/headers";

/* ================= LIST ================= */

export async function getExamsAction() {
  const cookieStore = await cookies();
  const token = cookieStore.get("ueas_org_token")?.value;

  if (!token) throw new Error("Session missing");

  const res = await serverFetch("/api/ueas/exams/list", {
    method: "GET",
    headers: {
      "x-internal-token": process.env.INTERNAL_API_TOKEN!,
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok || !res.data?.success) {
    throw new Error(res.data?.error || "Failed to load exams");
  }

  return {
    exams: res.data.exams,
    credits: res.data.credits,
  };
}


/* ================= CREATE ================= */

export async function createExamAction(payload: any) {
  const cookieStore = await cookies();
  const token = cookieStore.get("ueas_org_token")?.value;

  if (!token) throw new Error("Session missing");

  const res = await serverFetch("/api/ueas/exams/create", {
    method: "POST",
    headers: {
      "x-internal-token": process.env.INTERNAL_API_TOKEN!,
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok || !res.data?.success) {
    throw new Error(res.data?.error || "Failed to create exam");
  }

  return res.data.exam;
}



export async function getExamDetailAction(examId: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("ueas_org_token")?.value;

  if (!token) {
    throw new Error("Organization session missing");
  }

  const res = await serverFetch(
    `/api/ueas/exams/detail?exam_id=${examId}`,
    {
      method: "GET",
      headers: {
        "x-internal-token": process.env.INTERNAL_API_TOKEN!,
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok || !res.data?.success) {
    throw new Error(res.data?.error || "Failed to load exam");
  }
  console.log('getExamDetailAction : '+JSON.stringify(res))
  return res.data;
}


export async function assignExamBatchesAction(
  examId: string,
  batchIds: string[]
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("ueas_org_token")?.value;

  if (!token) {
    throw new Error("Organization session missing");
  }

  if (!examId || batchIds.length === 0) {
    throw new Error("Exam and batches required");
  }

  const res = await serverFetch("/api/ueas/exams/assign-batches", {
    method: "POST",
    headers: {
      "x-internal-token": process.env.INTERNAL_API_TOKEN!,
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      exam_id: examId,
      batch_ids: batchIds,
    }),
  });
  
  if (!res.ok || !res.data?.success) {
    throw new Error(res.data?.error || "Failed to assign batches");
  }

  return res.data;
}


export async function sendExamCredentialsAction(
  examId: string,
  batchId: string
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("ueas_org_token")?.value;

  if (!token) {
    throw new Error("Organization session missing");
  }
  console.log('sendExamCredentialsAction examId : '+examId+' batchId : '+batchId);
  const res = await serverFetch(
    "/api/ueas/exams/send-credentials",
    {
      method: "POST",
      headers: {
        "x-internal-token": process.env.INTERNAL_API_TOKEN!,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        exam_id: examId,
        batch_id: batchId,
      }),
    }
  );
 
  if (!res.ok || !res.data?.success) {
    throw new Error(res.data?.error || "Failed to send credentials");
  }

 
  /**
   * Expected:
   * {
   *   success: true,
   *   sent,
   *   failed,
   *   total_students
   * }
   */
  return res.data;
}


export async function sendExamInviteAction(
  examId: string,
  batchId: string
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("ueas_org_token")?.value;

  if (!token) {
    throw new Error("Organization session missing");
  }

  const res = await serverFetch("/api/ueas/exams/send-invite", {
    method: "POST",
    headers: {
      "x-internal-token": process.env.INTERNAL_API_TOKEN!,
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      exam_id: examId,
      batch_id: batchId,
    }),
  });

  if (!res.ok || !res.data?.success) {
    throw new Error(res.data?.error || "Failed to send invite");
  }

  return res.data;
}