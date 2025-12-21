"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import crypto from "crypto";
import { getDB } from "@/lib/db";

export async function adminLoginAction(formData: FormData) {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  if (!email || !password) {
    throw new Error("Invalid credentials");
  }

  const db = await getDB();

  // 🔍 Validate admin
  const [rows]: any = await db.execute(
    `
    SELECT id, email, password_hash, last_login
    FROM admin_users
    WHERE email = ? AND is_active = 1
    LIMIT 1
    `,
    [email]
  );

  if (!rows?.length) {
    throw new Error("Invalid credentials");
  }

  const admin = rows[0];

  const hash = crypto
    .createHash("sha256")
    .update(password)
    .digest("hex");

  if (hash !== admin.password_hash) {
    throw new Error("Invalid credentials");
  }

  // 🔐 Create session token
  const sessionToken = crypto.randomUUID();
  const isProd = process.env.NODE_ENV === "production";

  // 🍪 Set cookies (SERVER ONLY)
  const cookieStore = await cookies();

  cookieStore.set("admin_session", sessionToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24, // 1 day
  });

  cookieStore.set("admin_id", String(admin.id), {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  cookieStore.set("admin_email", admin.email, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  // (Optional, for audit/UI)
  cookieStore.set(
    "admin_last_login",
    admin.last_login ? String(admin.last_login) : "",
    {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    }
  );

  // 💾 Persist session in DB
  await db.execute(
    `
    UPDATE admin_users
    SET session_token = ?, last_login = NOW()
    WHERE id = ?
    `,
    [sessionToken, admin.id]
  );

  // 🚀 Redirect to dashboard
  redirect("/secure-console/dashboard");
}


export async function adminLogoutAction() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("admin_session")?.value;

  if (sessionToken) {
    const db = await getDB();
    await db.execute(
      `
      UPDATE admin_users
      SET session_token = NULL
      WHERE session_token = ?
      `,
      [sessionToken]
    );
  }

  // ❌ Clear all admin cookies
  cookieStore.delete("admin_session");
  cookieStore.delete("admin_id");
  cookieStore.delete("admin_email");
  cookieStore.delete("admin_last_login");

  redirect("/secure-console/login");
}
