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
