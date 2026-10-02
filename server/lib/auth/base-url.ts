// Origin the auth server/client talk to. In development this defaults to
// http://localhost:3000; set NEXT_PUBLIC_DEV_URL to run the dev server elsewhere.
export const authBaseURL =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_BETTER_AUTH_URL
    : process.env.NEXT_PUBLIC_DEV_URL || "http://localhost:3000";
