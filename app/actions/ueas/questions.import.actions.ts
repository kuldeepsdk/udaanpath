"use server";

import { serverFetch } from "@/lib/fetcher";
import { cookies } from "next/headers";

/* ================= UPLOAD CSV ================= */

export async function uploadQuestionsCsvAction(file: File) {
  const cookieStore = await cookies();
  const token = cookieStore.get("ueas_org_token")?.value;

  if (!token) throw new Error("Organization session missing");

  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(
    `${process.env.INTERNAL_API_BASE_URL}/api/ueas/questions/upload-csv`,
    {
      method: "POST",
      headers: {
        "x-internal-token": process.env.INTERNAL_API_TOKEN!,
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error || "CSV upload failed");
  }

  return json; // { upload_id }
}

/* ================= IMPORT CSV ================= */

export async function importQuestionsCsvAction(upload_id: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("ueas_org_token")?.value;

  if (!token) throw new Error("Organization session missing");

  const res = await serverFetch("/api/ueas/questions/import-csv", {
    method: "POST",
    headers: {
      "x-internal-token": process.env.INTERNAL_API_TOKEN!,
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ upload_id }),
  });

  if (!res.ok || !res.data?.success) {
    throw new Error(res.data?.error || "Import failed");
  }

  return res.data;
}






export interface PendingCsvUpload {
  id: string;
  status: "pending" | "partial" | "imported";
  total_rows: number;
  imported_rows: number;
  failed_rows: number;
  created_at: string;
}

/* =====================================================
   GET PENDING / PARTIAL CSV UPLOADS
===================================================== */

export async function getPendingCsvUploadsAction(): Promise<
  PendingCsvUpload[]
> {
  const cookieStore = await cookies();
  const orgToken = cookieStore.get("ueas_org_token")?.value;

  if (!orgToken) {
    throw new Error("Organization session missing");
  }

  const res = await serverFetch("/api/ueas/questions/csv-uploads", {
    method: "GET",
    headers: {
      "x-internal-token": process.env.INTERNAL_API_TOKEN!,
      Authorization: `Bearer ${orgToken}`,
    },
    cache: "no-store",
  });

  if (!res.ok || !res.data?.success) {
    throw new Error(res.data?.error || "Failed to fetch CSV uploads");
  }

  /**
   * Expected API response:
   * {
   *   success: true,
   *   uploads: [
   *     {
   *       id,
   *       status,
   *       total_rows,
   *       imported_rows,
   *       failed_rows,
   *       created_at
   *     }
   *   ]
   * }
   */
  return res.data.uploads || [];
}
