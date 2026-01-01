"use server";

import { serverFetch } from "@/lib/fetcher";
import { cookies } from "next/headers";

/* ================= LIST BATCHES ================= */

export async function getBatchesAction() {
  const cookieStore = await cookies();
  const token = cookieStore.get("ueas_org_token")?.value;

  if (!token) throw new Error("Organization session missing");

  const res = await serverFetch("/api/ueas/batch/list", {
    method: "GET",
    headers: {
      "x-internal-token": process.env.INTERNAL_API_TOKEN!,
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok || !res.data?.success) {
    throw new Error(res.data?.error || "Failed to load batches");
  }

  return res.data.batches;
}

/* ================= CREATE BATCH ================= */

export async function createBatchAction(payload: {
  name: string;
  description?: string;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("ueas_org_token")?.value;

  if (!token) throw new Error("Organization session missing");

  if (!payload.name?.trim()) {
    throw new Error("Batch name required");
  }

  const res = await serverFetch("/api/ueas/batch/create", {
    method: "POST",
    headers: {
      "x-internal-token": process.env.INTERNAL_API_TOKEN!,
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok || !res.data?.success) {
    throw new Error(res.data?.error || "Failed to create batch");
  }

  return res.data.batch;
}

/* ================= ADD STUDENTS ================= */

export async function addStudentsToBatchAction(
  batchId: string,
  students: {
    name: string;
    email?: string;
    mobile?: string;
  }[]
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("ueas_org_token")?.value;

  if (!token) {
    throw new Error("Organization session missing");
  }

  if (!batchId || !students || students.length === 0) {
    throw new Error("Batch ID and students are required");
  }

  const res = await serverFetch("/api/ueas/batch/add-students", {
    method: "POST",
    headers: {
      "x-internal-token": process.env.INTERNAL_API_TOKEN!,
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      batch_id: batchId,
      students,
    }),
  });

  if (!res.ok || !res.data?.success) {
    throw new Error(res.data?.error || "Failed to add students");
  }

  /**
   * Expected response:
   * {
   *   success: true,
   *   created_count: number,
   *   credentials: [
   *     { name, roll_no, password }
   *   ]
   * }
   */
  return res.data;
}

/* ================= BULK UPLOAD ================= */

export async function bulkUploadStudentsAction(
  batchId: string,
  rows: any[]
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("ueas_org_token")?.value;

  if (!token) throw new Error("Organization session missing");

  const res = await serverFetch("/api/ueas/batch/bulk-upload", {
    method: "POST",
    headers: {
      "x-internal-token": process.env.INTERNAL_API_TOKEN!,
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      batch_id: batchId,
      rows,
    }),
  });

  if (!res.ok || !res.data?.success) {
    throw new Error(res.data?.error || "Bulk upload failed");
  }

  return res.data;
}



export async function getBatchDetailAction(batchId: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("ueas_org_token")?.value;

  if (!token) {
    throw new Error("Organization session missing");
  }

  const res = await serverFetch(
    `/api/ueas/batch/detail?batch_id=${batchId}`,
    {
      method: "GET",
      headers: {
        "x-internal-token": process.env.INTERNAL_API_TOKEN!,
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok || !res.data?.success) {
    throw new Error(res.data?.error || "Failed to load batch details");
  }

  /**
   * Expected response:
   * {
   *   success: true,
   *   batch: {...},
   *   students: [...]
   * }
   */
  return res.data;
}

export async function uploadStudentsCsvAction(
  batchId: string,
  rows: any[]
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("ueas_org_token")?.value;
  if (!token) throw new Error("Session missing");

  const res = await serverFetch("/api/ueas/batch/upload-csv", {
    method: "POST",
    headers: {
      "x-internal-token": process.env.INTERNAL_API_TOKEN!,
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ batch_id: batchId, rows }),
  });

  if (!res.ok || !res.data?.success) {
    throw new Error(res.data?.error || "CSV upload failed");
  }

  return res.data;
}

export async function importStudentsCsvAction(uploadId: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("ueas_org_token")?.value;
  if (!token) throw new Error("Session missing");

  const res = await serverFetch("/api/ueas/batch/import-csv", {
    method: "POST",
    headers: {
      "x-internal-token": process.env.INTERNAL_API_TOKEN!,
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ upload_id: uploadId }),
  });
  console.log('importStudentsCsvAction : '+JSON.stringify(res));
  if (!res.ok || !res.data?.success) {
    throw new Error(res.data?.error || "Import failed");
  }

  return res.data;
}



export async function uploadBatchStudentsCsvAction(
  batchId: string,
  file: File
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("ueas_org_token")?.value;

  if (!token) throw new Error("Organization session missing");

  const formData = new FormData();
  formData.append("file", file);
  formData.append("batch_id", batchId);

  const res = await fetch(`${process.env.INTERNAL_API_BASE_URL}/api/ueas/batch/upload-csv`, {
    method: "POST",
    headers: {
      "x-internal-token": process.env.INTERNAL_API_TOKEN!,
      Authorization: `Bearer ${token}`,
    },
    body: formData, // ✅ multipart
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || "Upload failed");
  }

  return data;
}


/* =====================================================
   FINAL CSV IMPORT
===================================================== */
export async function importBatchStudentsCsvAction(uploadId: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("ueas_org_token")?.value;

  const res = await serverFetch("/api/ueas/batch/import-csv", {
    method: "POST",
    headers: {
      "x-internal-token": process.env.INTERNAL_API_TOKEN!,
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ upload_id: uploadId }),
  });

  if (!res.ok || !res.data?.success) {
    throw new Error(res.data?.error || "Import failed");
  }

  return res.data;
}
