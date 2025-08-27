import { betterFetch } from "@better-fetch/fetch";
import type { auth } from "../server/lib/auth/auth";
import { NextRequest, NextResponse } from "next/server";
import { checkAndUpdateRateLimit } from "./actions/checkAndUpdateRateLimit";

type Session = typeof auth.$Infer.Session;

export async function middleware(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("cf-connecting-ip") ||
    "0.0.0.0";

  const allowed = await checkAndUpdateRateLimit(ip);

  if (!allowed) {
    return new NextResponse(JSON.stringify({ error: "Too many requests" }), {
      status: 429,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { data: session } = await betterFetch<Session>("api/auth/get-session", {
    baseURL: request.nextUrl.origin,
    headers: {
      cookie: request.headers.get("cookie") || "",
    },
  });

  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path",
    "/admin",
    "/select-role",
    "/sign-up/verify-email",
    "/api/:path",
  ],
};
