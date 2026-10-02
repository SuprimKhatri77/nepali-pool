import { createAuthClient } from "better-auth/react";
import { stripeClient } from "@better-auth/stripe/client";
import { authBaseURL } from "./base-url";

export const authClient = createAuthClient({
  baseURL: authBaseURL,
});
