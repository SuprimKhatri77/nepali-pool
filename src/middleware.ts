import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function middleware(request: NextRequest) {
  // console.log("🔹 Middleware hit:", request.nextUrl.pathname);
  const cookies = getSessionCookie(request);
  if (!cookies) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  // runtime: "nodejs",
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/select-role",
    // "/api/:path*",
    "/admin/:path*",
    "/chats/:path*",
    "/video-call/:path*",
    "/select-role",
    "/payment/:path*",
    "/waitlist",
    "/rejected",
  ],
};
