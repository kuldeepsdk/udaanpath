"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { serverFetch } from "@/lib/fetcher";

export async function ueasOrgLoginAction(
  email: string,
  password: string
) {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const res = await serverFetch("/api/ueas/org/login", {
    method: "POST",
    headers: {
      "x-internal-token": process.env.INTERNAL_API_TOKEN!,
    },
    body: JSON.stringify({ email, password }),
  });
  console.log('res response : '+JSON.stringify(res));
  if (!res.ok || !res.data?.success) {
    throw new Error(res.data?.error || "Invalid login credentials");
  }

  const { token, user } = res.data;

  // ✅ IMPORTANT FIX: await cookies()
  const cookieStore = await cookies();

  cookieStore.set("ueas_org_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  cookieStore.set("ueas_org_user", JSON.stringify(user), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  redirect("/ueas/org/dashboard");
}


export async function ueasOrgLogoutAction() {
  const cookieStore = await cookies();

  const token = cookieStore.get("ueas_org_token")?.value;

  // 🔁 Call API only if token exists
  if (token) {
    await serverFetch("/api/ueas/org/logout", {
      method: "POST",
      headers: {
        "x-internal-token": process.env.INTERNAL_API_TOKEN!,
        "Authorization": token,
      },
    });
  }

  // 🧹 Clear cookies
  cookieStore.delete("ueas_org_token");
  cookieStore.delete("ueas_org_user");

  redirect("/ueas/org/login");
}