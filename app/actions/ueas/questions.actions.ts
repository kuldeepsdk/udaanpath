"use server";

import { serverFetch } from "@/lib/fetcher";
import { cookies } from "next/headers";

/* =====================================================
   SUBJECTS
===================================================== */

export async function getQuestionSubjectsAction(): Promise<string[]> {
  const cookieStore = await cookies();
  const orgToken = cookieStore.get("ueas_org_token")?.value;

  if (!orgToken) throw new Error("Organization session missing");

  const res = await serverFetch("/api/ueas/questions/subjects", {
    method: "GET",
    headers: {
      "x-internal-token": process.env.INTERNAL_API_TOKEN!,
      Authorization: `Bearer ${orgToken}`,
    },
  });

  if (!res.ok || !res.data?.success) {
    throw new Error(res.data?.error || "Failed to fetch subjects");
  }

  return res.data.subjects || [];
}

/* =====================================================
   QUESTION LISTING
===================================================== */

export interface QuestionListFilters {
  search?: string;
  subject?: string;
  difficulty?: "easy" | "medium" | "hard";
  language?: string;
  is_published?: 0 | 1;
  page?: number;
  limit?: number;
}

export async function getQuestionsAction(
  filters: QuestionListFilters = {}
) {
  const cookieStore = await cookies();
  const orgToken = cookieStore.get("ueas_org_token")?.value;

  if (!orgToken) throw new Error("Organization session missing");

  const params = new URLSearchParams();

  if (filters.search) params.set("search", filters.search);
  if (filters.subject) params.set("subject", filters.subject);
  if (filters.difficulty) params.set("difficulty", filters.difficulty);
  if (filters.language) params.set("language", filters.language);
  if (filters.is_published !== undefined)
    params.set("is_published", String(filters.is_published));

  params.set("page", String(filters.page ?? 1));
  params.set("limit", String(filters.limit ?? 20));

  const res = await serverFetch(
    `/api/ueas/questions/list?${params.toString()}`,
    {
      method: "GET",
      headers: {
        "x-internal-token": process.env.INTERNAL_API_TOKEN!,
        Authorization: `Bearer ${orgToken}`,
      },
    }
  );
  console.log('final res is : '+JSON.stringify(res));
  if (!res.ok || !res.data?.success) {
    throw new Error(res.data?.error || "Failed to fetch questions");
  }

  return res.data;
}

/* =====================================================
   CREATE QUESTION
===================================================== */

export interface CreateQuestionPayload {
  question_text: string;
  question_type: "mcq_single" | "mcq_multi";
  difficulty: "easy" | "medium" | "hard";
  marks: number;
  negative_marks: number;
  subject?: string;
  topic?: string;
  analysis?: string; // HTML
  options: { text: string; is_correct: boolean }[];

  tags?: string[];
  estimated_time_sec?: number;
  source?: "custom" | "book" | "previous_exam" | "online";
  reference_link?: string;
  language?: string;
  is_published?: 0 | 1;
}

export async function createQuestionAction(payload: CreateQuestionPayload) {
  const cookieStore = await cookies();
  const orgToken = cookieStore.get("ueas_org_token")?.value;

  if (!orgToken) {
    throw new Error("Organization session missing");
  }

  if (!payload.question_text || payload.options.length < 2) {
    throw new Error("Invalid question data");
  }

  /* ---------- CREATE QUESTION ---------- */
  const qRes = await serverFetch("/api/ueas/questions/create", {
    method: "POST",
    headers: {
      "x-internal-token": process.env.INTERNAL_API_TOKEN!,
      Authorization: `Bearer ${orgToken}`,
    },
    body: JSON.stringify({
      question_text: payload.question_text,
      question_type: payload.question_type,
      marks: payload.marks,
      negative_marks: payload.negative_marks,
      difficulty: payload.difficulty,
      subject: payload.subject || null,
      topic: payload.topic || null,
      question_analysis: payload.analysis || null,
      tags: payload.tags || [],
      estimated_time_sec: payload.estimated_time_sec || null,
      source: payload.source || "custom",
      reference_link: payload.reference_link || null,
      language: payload.language || "en",
      is_published: payload.is_published ?? 1,
    }),
  });

  if (!qRes.ok || !qRes.data?.success) {
    throw new Error(qRes.data?.error || "Failed to create question");
  }

  const questionId = qRes.data.question_id;

  /* ---------- ADD OPTIONS ---------- */
  const optRes = await serverFetch("/api/ueas/questions/add-options", {
    method: "POST",
    headers: {
      "x-internal-token": process.env.INTERNAL_API_TOKEN!,
      Authorization: `Bearer ${orgToken}`,
    },
    body: JSON.stringify({
      question_id: questionId,
      options: payload.options,
    }),
  });

  if (!optRes.ok || !optRes.data?.success) {
    throw new Error(optRes.data?.error || "Failed to add options");
  }

  return { success: true, questionId };
}
