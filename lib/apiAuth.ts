// lib/apiAuth.ts

import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";

type ApiAuthResult =
  | { ok: true; admin?: { id: number; email: string } }
  | { ok: false; response: NextResponse };

/* =========================
   Response Helpers
========================= */

function unauthorized(message = "Unauthorized") {
  return {
    ok: false as const,
    response: NextResponse.json(
      { success: false, error: message },
      { status: 401 }
    ),
  };
}

function badRequest(message = "Bad Request") {
  return {
    ok: false as const,
    response: NextResponse.json(
      { success: false, error: message },
      { status: 400 }
    ),
  };
}

/* =========================
   Header Utilities (IMPORTANT)
========================= */

/**
 * Read internal token defensively.
 * Supports infra/runtime normalization.
 */
function getInternalToken(req: Request): string | null {
  return (
    req.headers.get("x-internal-token") ||
    req.headers.get("X-Internal-Token")
  );
}

function getHeader(req: Request, key: string): string | null {
  return (
    req.headers.get(key) ||
    req.headers.get(key.toLowerCase()) ||
    req.headers.get(
      key
        .split("-")
        .map((k) => k.charAt(0).toUpperCase() + k.slice(1))
        .join("-")
    )
  );
}

/* =========================
   Internal API Auth
========================= */

/**
 * Validate internal token for ALL APIs.
 * Required header: x-internal-token
 */
export async function validateInternalApi(
  req: Request
): Promise<ApiAuthResult> {
  const token = getInternalToken(req);

  if (!token) {
    return unauthorized("Missing internal token");
  }

  if (token.trim() !== process.env.INTERNAL_API_TOKEN?.trim()) {
    return unauthorized("Invalid internal token : token : " + token+' env token : '+process.env.INTERNAL_API_TOKEN);
  }

  return { ok: true };
}

/* =========================
   Admin API Auth
========================= */

/**
 * Validate admin API access.
 *
 * Requirements:
 * 1) Internal token must be valid
 * 2) x-admin-id & x-admin-session must be present
 * 3) DB verification (id + session_token + is_active)
 */
export async function validateAdminApi(
  req: Request
): Promise<ApiAuthResult> {
  // 1) Internal token check
  const base = await validateInternalApi(req);
  if (!base.ok) return base;

  // 2) Admin headers (defensive read)
  const adminIdRaw = getHeader(req, "x-admin-id");
  const adminSession = getHeader(req, "x-admin-session");

  if (!adminIdRaw || !adminSession) {
    return badRequest("Missing admin credentials");
  }

  // 3) DB verify
  const db = await getDB();
  const [rows]: any = await db.execute(
    `
    SELECT id, email
    FROM admin_users
    WHERE id = ?
      AND session_token = ?
      AND is_active = 1
    LIMIT 1
    `,
    [adminIdRaw, adminSession]
  );

  if (!rows?.length) {
    return unauthorized("Invalid admin session");
  }

  return { ok: true, admin: rows[0] };
}
