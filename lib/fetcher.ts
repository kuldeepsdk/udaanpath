export async function serverFetch(
  path: string,
  options: RequestInit = {}
) {
  const baseUrl = process.env.INTERNAL_API_BASE_URL || "http://localhost:3000";

  const res = await fetch(baseUrl + path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`API Error: ${res.status}`);
  }

  return res.json();
}
