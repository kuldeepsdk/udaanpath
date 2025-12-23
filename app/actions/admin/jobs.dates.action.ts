// app/actions/admin/jobs.dates.action.ts
"use server";

import { getApiBaseUrl, getAdminHeaders } from "@/app/actions/admin/_helpers";

/* -------------------------
   Add Date
-------------------------- */
export async function addJobDateAction(
  jobId: string,
  payload: {
    event_key: string;
    event_label: string;
    event_date?: string | null;
  }
) {
  const res = await fetch(
    `${await getApiBaseUrl()}/api/admin/jobs/${jobId}/dates`,
    {
      method: "POST",
      headers: await getAdminHeaders(),
      body: JSON.stringify(payload),
      cache: "no-store",
    }
  );

  if (!res.ok) {
    const text = await res.text();
    console.error("addJobDateAction failed:", text);
    throw new Error("Failed to add date");
  }
}

/* -------------------------
   Delete Date
-------------------------- */
export async function deleteJobDateAction(
  jobId: string,
  dateId: number
) {
  const res = await fetch(
    `${await getApiBaseUrl()}/api/admin/jobs/${jobId}/dates/${dateId}`,
    {
      method: "DELETE",
      headers: await getAdminHeaders(),
      cache: "no-store",
    }
  );

  if (!res.ok) {
    const text = await res.text();
    console.error("deleteJobDateAction failed:", text);
    throw new Error("Failed to delete date");
  }
}
/* -------------------------
  Bulk Actions
-------------------------- */
/* -------------------------
   Bulk Add Dates
-------------------------- */
export async function addJobDatesBulkAction(
  jobId: string,
  dates: {
    event_key: string;
    event_label: string;
    event_date?: string | null;
  }[]
) {
  if (!jobId) throw new Error("Invalid jobId");

  const cleanDates = dates
    .map((d) => ({
      event_key: d.event_key?.trim(),
      event_label: d.event_label?.trim(),
      event_date: d.event_date || null,
    }))
    .filter(
      (d) => d.event_key && d.event_label
    );

  if (cleanDates.length === 0) return;

  const res = await fetch(
    `${await getApiBaseUrl()}/api/admin/jobs/${jobId}/dates/bulk`,
    {
      method: "POST",
      headers: await getAdminHeaders(),
      body: JSON.stringify({
        action: "add",
        dates: cleanDates,
      }),
      cache: "no-store",
    }
  );

  const data = await res.json();

  if (!res.ok || data?.success === false) {
    console.error("addJobDatesBulkAction failed:", data);
    throw new Error(data?.error || "Failed to add dates");
  }
}


export async function deleteJobDatesBulkAction(
  jobId: string,
  ids: number[]
) {
  // 🔐 HARD GUARDS
  if (!jobId) {
    throw new Error("Invalid jobId");
  }

  const cleanIds = ids.filter(
    (id): id is number => typeof id === "number"
  );

  if (cleanIds.length === 0) {
    throw new Error("No valid date ids provided");
  }

  const res = await fetch(
    `${await getApiBaseUrl()}/api/admin/jobs/${jobId}/dates/bulk`,
    {
      method: "POST",
      headers: await getAdminHeaders(),
      body: JSON.stringify({ action: "delete", ids: cleanIds }),
      cache: "no-store",
    }
  );

  const data = await res.json();

  if (!res.ok || data?.success === false) {
    console.error("deleteJobDatesBulkAction failed:", data);
    throw new Error(data?.error || "Failed to delete dates");
  }
}


