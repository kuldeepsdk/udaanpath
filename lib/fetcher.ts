export async function serverFetch(
  path: string,
  options: RequestInit = {}
) {
  const baseUrl =
    process.env.INTERNAL_API_BASE_URL || "http://localhost:3000";

  const finalUrl = baseUrl + path;

  console.log("[serverFetch]", {
    url: finalUrl,
    method: options.method || "GET",
  });

  let response: Response;

  try {
    response = await fetch(finalUrl, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      cache: "no-store",
    });
  } catch (err: any) {
    // 🔥 Network / DNS / connection error
    return {
      ok: false,
      status: 0,
      data: {
        success: false,
        error: "Unable to connect to API server",
        details: err?.message,
      },
    };
  }

  let data: any = null;

  try {
    // Try JSON first
    data = await response.json();
  } catch {
    // Non-JSON response (HTML, empty body, etc.)
    data = {
      success: false,
      error: "API returned non-JSON response",
    };
  }

  return {
    ok: response.ok,
    status: response.status,
    data,
  };
}
