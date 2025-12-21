import { serverFetch } from "@/lib/fetcher";

export async function getJobsFromAPI() {
  return serverFetch("/api/jobs");
}
