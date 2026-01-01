"use server";

import { serverFetch } from "@/lib/fetcher";

/* ---------- START EXAM ---------- */
export async function startExamAction(payload: {
  exam_id: string;
  token: string;
}) {
  if (!payload.token) {
    throw new Error("Student session missing");
  }

  const res = await serverFetch(
    "/api/ueas/student/exam/start",
    {
      method: "POST",
      headers: {
        "x-internal-token": process.env.INTERNAL_API_TOKEN!,
        Authorization: `Bearer ${payload.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ exam_id: payload.exam_id }),
      cache: "no-store",
    }
  );
  console.log("startExamAction res : "+JSON.stringify(res));
  if (!res.ok || !res.data?.success) {
    throw new Error(res.data?.error || "Failed to start exam");
  }

  return res.data;
}

/* ---------- AUTOSAVE ---------- */
export async function autosaveAnswerAction(payload: {
  exam_id: string;
  question_id: string;
  selected_options: string[];
  token: string;
}) {
  if (!payload.token) return;

  await serverFetch(
    "/api/ueas/student/exam/autosave",
    {
      method: "POST",
      headers: {
        "x-internal-token": process.env.INTERNAL_API_TOKEN!,
        Authorization: `Bearer ${payload.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        exam_id: payload.exam_id,
        question_id: payload.question_id,
        selected_options: payload.selected_options,
      }),
      cache: "no-store",
    }
  );
}

/* ---------- SUBMIT ---------- */

export async function submitExamAction(payload: {
  exam_id: string;
  token: string;
}) {
  if (!payload.token) {
    throw new Error("Student session missing");
  }

  const res = await serverFetch(
    "/api/ueas/student/exam/submit",
    {
      method: "POST",
      headers: {
        "x-internal-token": process.env.INTERNAL_API_TOKEN!,
        Authorization: `Bearer ${payload.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        exam_id: payload.exam_id,
      }),
      cache: "no-store",
    }
  );

  if (!res.ok || !res.data?.success) {
    throw new Error(res.data?.error || "Submit failed");
  }

  return res.data;
}