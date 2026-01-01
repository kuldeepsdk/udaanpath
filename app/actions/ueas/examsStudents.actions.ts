"use server";
import { serverFetch } from "@/lib/fetcher";
import { cookies } from "next/headers";

export async function getExamStudentsAction(params: {
  exam_id: string;

  page?: number;
  limit?: number;

  search?: string;
  invite_status?: string;
  credentials_status?: string;
  exam_status?: string;
}) {
  const {
    exam_id,
    page = 1,
    limit = 20,
    search = "",
    invite_status = "",
    credentials_status = "",
    exam_status = "",
  } = params;

  if (!exam_id) {
    throw new Error("exam_id is required");
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("ueas_org_token")?.value;

  if (!token) {
    throw new Error("Unauthorized");
  }

  /* ---------------- BUILD QUERY STRING ---------------- */
  const qs = new URLSearchParams({
    exam_id,
    page: String(page),
    limit: String(limit),
  });

  if (search) qs.set("search", search);
  if (invite_status) qs.set("invite_status", invite_status);
  if (credentials_status) qs.set("credentials_status", credentials_status);
  if (exam_status) qs.set("exam_status", exam_status);

  /* ---------------- IMPORTANT FIX ---------------- */
  const res = await serverFetch(
    `/api/ueas/exams/students?${qs.toString()}`,
    {
      headers: {
         "x-internal-token": process.env.INTERNAL_API_TOKEN!,
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  

 if (!res.ok || !res.data?.success) {
    throw new Error(res.data?.error || "Failed to create exam");
  }

  return res.data;
}
