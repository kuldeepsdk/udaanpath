"use server";

import { getApiBaseUrl, getAdminHeaders } from "@/app/actions/admin/_helpers";

/* -------------------------
   Add Link
-------------------------- */
export async function addJobLinkAction(
  jobId: string,
  payload: {
    link_type: string;
    label?: string;
    url: string;
  }
) {
  const res = await fetch(
    `${await getApiBaseUrl()}/api/admin/jobs/${jobId}/links`,
    {
      method: "POST",
      headers: await getAdminHeaders(),
      body: JSON.stringify(payload),
      cache: "no-store",
    }
  );

  if (!res.ok) {
    const text = await res.text();
    console.error("addJobLinkAction failed:", text);
    throw new Error("Failed to add link");
  }
}

/* -------------------------
   Delete Link
-------------------------- */
export async function deleteJobLinkAction(
  jobId: string,
  linkId: number
) {
  const res = await fetch(
    `${await getApiBaseUrl()}/api/admin/jobs/${jobId}/links/${linkId}`,
    {
      method: "DELETE",
      headers: await getAdminHeaders(),
      cache: "no-store",
    }
  );

  if (!res.ok) {
    const text = await res.text();
    console.error("deleteJobLinkAction failed:", text);
    throw new Error("Failed to delete link");
  }
}
