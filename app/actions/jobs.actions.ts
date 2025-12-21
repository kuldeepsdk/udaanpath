"use server";

import { getJobsFromAPI } from "@/app/services/jobs.service";

export async function getJobs() {
  // auth, validation, caching later
  return await getJobsFromAPI();
}
