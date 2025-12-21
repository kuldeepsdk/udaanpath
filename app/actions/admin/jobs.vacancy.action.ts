// app/actions/admin/jobs.vacancy.action.ts
"use server";

import { getApiBaseUrl, getAdminHeaders } from "@/app/actions/admin/_helpers";

/* -------------------------
   Add Vacancy Breakup
-------------------------- */
export async function addJobVacancyAction(
  jobId: string,
  payload: {
    post_name: string;
    total_posts: number;
  }
) {
  const res = await fetch(
    `${await getApiBaseUrl()}/api/admin/jobs/${jobId}/vacancy`,
    {
      method: "POST",
      headers: {
        ...(await getAdminHeaders()),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    }
  );

  if (!res.ok) {
    const text = await res.text();
    console.error("addJobVacancyAction failed:", text);
    throw new Error("Failed to add vacancy breakup");
  }
}

/* -------------------------
   Delete Vacancy Breakup
-------------------------- */
export async function deleteJobVacancyAction(
  jobId: string,
  vacancyId: number
) {
  const res = await fetch(
    `${await getApiBaseUrl()}/api/admin/jobs/${jobId}/vacancy/${vacancyId}`,
    {
      method: "DELETE",
      headers: await getAdminHeaders(),
      cache: "no-store",
    }
  );

  if (!res.ok) {
    const text = await res.text();
    console.error("deleteJobVacancyAction failed:", text);
    throw new Error("Failed to delete vacancy breakup");
  }
}
