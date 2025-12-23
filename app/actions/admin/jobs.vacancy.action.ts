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


/* -------------------------
 Bulk Operations
-------------------------- */

/* -------------------------
   Bulk Add Vacancy
-------------------------- */
export async function addJobVacancyBulkAction(
  jobId: string,
  vacancies: {
    post_name: string;
    total_posts: number;
  }[]
) {
  if (!jobId) throw new Error("Invalid jobId");

  const clean = vacancies
    .map((v) => ({
      post_name: v.post_name?.trim(),
      total_posts: Number(v.total_posts),
    }))
    .filter(
      (v) =>
        v.post_name &&
        Number.isInteger(v.total_posts) &&
        v.total_posts > 0
    );

  if (clean.length === 0) return;

  const res = await fetch(
    `${await getApiBaseUrl()}/api/admin/jobs/${jobId}/vacancy/bulk`,
    {
      method: "POST",
      headers: await getAdminHeaders(),
      body: JSON.stringify({
        action: "add",
        vacancies: clean,
      }),
      cache: "no-store",
    }
  );

  const data = await res.json();

  if (!res.ok || data?.success === false) {
    console.error("addJobVacancyBulkAction failed:", data);
    throw new Error(data?.error || "Failed to add vacancies");
  }
}

/* -------------------------
   Bulk Delete Vacancy
-------------------------- */
export async function deleteJobVacancyBulkAction(
  jobId: string,
  ids: number[]
) {
  const cleanIds = ids.filter(
    (id): id is number => Number.isInteger(id)
  );

  if (cleanIds.length === 0) return;

  const res = await fetch(
    `${await getApiBaseUrl()}/api/admin/jobs/${jobId}/vacancy/bulk`,
    {
      method: "POST",
      headers: await getAdminHeaders(),
      body: JSON.stringify({
        action: "delete",
        ids: cleanIds,
      }),
      cache: "no-store",
    }
  );

  const data = await res.json();

  if (!res.ok || data?.success === false) {
    console.error("deleteJobVacancyBulkAction failed:", data);
    throw new Error(data?.error || "Failed to delete vacancies");
  }
}