import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  /* =========================
     ORG ROUTES
  ========================== */

  if (pathname.startsWith("/ueas/org")) {

    // 🟢 Public org pages (NO AUTH)
    const publicOrgRoutes = [
      "/ueas/org/login",
      "/ueas/org/register",
      "/ueas/org/verify-otp",
    ];

    if (publicOrgRoutes.some((p) => pathname.startsWith(p))) {
      return NextResponse.next();
    }

    // 🔒 Protected org area
    const orgToken = req.cookies.get("ueas_org_token")?.value;

    if (!orgToken) {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = "/ueas/org/login";
      loginUrl.searchParams.set("reason", "auth_required");
      return NextResponse.redirect(loginUrl);
    }
  }

  /* =========================
     STUDENT ROUTES
  ========================== */

  if (pathname.startsWith("/ueas/std")) {

    // 🟢 Public student pages
    const publicStdRoutes = [
      "/ueas/std/login",
      "/ueas/std/register",
      "/ueas/std/verify-otp",
      "/ueas/std/exam-preview", // if any
    ];

    if (publicStdRoutes.some((p) => pathname.startsWith(p))) {
      return NextResponse.next();
    }

    // 🔒 Protected student area
    const stdToken = req.cookies.get("ueas_std_token")?.value;

    if (!stdToken) {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = "/ueas/std/login";
      loginUrl.searchParams.set("reason", "auth_required");
      return NextResponse.redirect(loginUrl);
    }
  }

  /* =========================
     EVERYTHING ELSE (PUBLIC)
  ========================== */

  return NextResponse.next();
}

/* =========================
   MATCHER (IMPORTANT)
========================== */

export const config = {
  matcher: [
    "/ueas/org/:path*",
    "/ueas/std/:path*",
  ],
};
