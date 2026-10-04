import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

// Cheap first gate: only checks that a session cookie exists (no database
// call). Pages still verify the session and the user's role themselves via
// server/lib/auth/guards.ts.
export async function proxy(request: NextRequest) {
  if (getSessionCookie(request)) return NextResponse.next();

  const { pathname, search } = request.nextUrl;
  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("message", "Please login to continue");
  loginUrl.searchParams.set("next", `${pathname}${search}`);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/select-role",
    "/onboarding/:path*",
    "/profile",
    "/add-school",
    "/connect-student/update/:path*",
    "/chats/:path*",
    "/video-call/:path*",
    "/payment/:path*",
    "/waitlist",
    "/rejected",
  ],
};
