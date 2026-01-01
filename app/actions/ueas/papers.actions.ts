// app/actions/ueas/papers.actions.ts
"use server";

import { serverFetch } from "@/lib/fetcher";
import { cookies } from "next/headers";

/* ================= LIST PAPERS ================= */

export interface PaperListParams {
  page?: number;
  limit?: number;

  search?: string;       // paper name search
  is_active?: 0 | 1;     // active / inactive
}


export async function getPapersAction(
  params: PaperListParams = {}
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("ueas_org_token")?.value;

  if (!token) {
    throw new Error("Organization session missing");
  }

  /* ---------------- QUERY PARAMS ---------------- */
  const query = new URLSearchParams();

  query.set("page", String(params.page ?? 1));
  query.set("limit", String(params.limit ?? 10));

  if (params.search?.trim()) {
    query.set("search", params.search.trim());
  }

  if (params.is_active !== undefined) {
    query.set("is_active", String(params.is_active));
  }

  /* ---------------- API CALL ---------------- */
  const res = await serverFetch(
    `/api/ueas/papers/list?${query.toString()}`,
    {
      method: "GET",
      headers: {
        "x-internal-token": process.env.INTERNAL_API_TOKEN!,
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok || !res.data?.success) {
    throw new Error(res.data?.error || "Failed to load papers");
  }

  /**
   * Expected response:
   * {
   *   success: true,
   *   page,
   *   limit,
   *   count,
   *   papers: []
   * }
   */
  return res.data;
}


/* ================= CREATE PAPER ================= */

export async function createPaperAction(payload: {
  name: string;
  description?: string;
  default_duration_minutes?: number;
  instructions?: string;
}) {
  const cookieStore = await cookies(); // ✅ FIX
  const token = cookieStore.get("ueas_org_token")?.value;

  if (!token) {
    throw new Error("Organization session missing");
  }

  const res = await serverFetch("/api/ueas/papers/create", {
    method: "POST",
    headers: {
      "x-internal-token": process.env.INTERNAL_API_TOKEN!,
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok || !res.data?.success) {
    throw new Error(res.data?.error || "Failed to create paper");
  }

  return res.data.paper;
}



export async function getPaperPreviewAction(paper_id: string) {
  const cookieStore = await cookies(); 
  const token = cookieStore.get("ueas_org_token")?.value;

  if (!token) throw new Error("Organization session missing");

  const res = await serverFetch(
    `/api/ueas/papers/preview?paper_id=${paper_id}`,
    {
      method: "GET",
      headers: {
        "x-internal-token": process.env.INTERNAL_API_TOKEN!,
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok || !res.data?.success) {
    throw new Error(res.data?.error || "Failed to load paper");
  }

  return res.data; // { paper, questions }
}


export async function addQuestionsToPaperAction(
  paper_id: string,
  question_ids: string[]
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("ueas_org_token")?.value;

  if (!token) throw new Error("Organization session missing");

  const res = await serverFetch("/api/ueas/papers/add-questions", {
    method: "POST",
    headers: {
      "x-internal-token": process.env.INTERNAL_API_TOKEN!,
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ paper_id, question_ids }),
  });

  if (!res.ok || !res.data?.success) {
    throw new Error(res.data?.error || "Failed to add questions");
  }

  return res.data;
}

export async function removeQuestionFromPaperAction(
  paper_id: string,
  question_id: string
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("ueas_org_token")?.value;

  if (!token) throw new Error("Organization session missing");

  const res = await serverFetch("/api/ueas/papers/remove-question", {
    method: "POST",
    headers: {
      "x-internal-token": process.env.INTERNAL_API_TOKEN!,
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ paper_id, question_id }),
  });

  if (!res.ok || !res.data?.success) {
    throw new Error(res.data?.error || "Failed to remove question");
  }

  return res.data;
}




interface UpdatePaperPayload {
  name: string;
  description?: string;
  default_duration_minutes: number;
  is_active: 0 | 1;
}

export async function updatePaperAction(
  paperId: string,
  payload: UpdatePaperPayload
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("ueas_org_token")?.value;

  if (!token) {
    throw new Error("Organization session missing");
  }

  const res = await serverFetch("/api/ueas/papers/update", {
    method: "POST",
    headers: {
      "x-internal-token": process.env.INTERNAL_API_TOKEN!,
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      paper_id: paperId,
      ...payload,
    }),
  });

  if (!res.ok || !res.data?.success) {
    throw new Error(res.data?.error || "Failed to update paper");
  }

  return res.data;
}