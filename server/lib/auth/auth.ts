import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../../../lib/db";
import { sendEmail } from "../send-email";
import { nextCookies } from "better-auth/next-js";
import { Resend } from "resend";
import EmailVerification from "@/components/VerifyEmailMessage";
import * as schema from "../../../lib/db/schema";

const resend = new Resend(process.env.RESEND_API_KEY as string);

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  secret: process.env.BETTER_AUTH_SECRET,
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    requireEmailVerification: false,
    resetPasswordTokenExpiresIn: 300,
    sendResetPassword: async ({ user, url, token }, request) => {
      await sendEmail({
        to: user.email,
        subject: "Reset your password",
        html: `Click the link to reset your password: ${url}`,
      });
    },
  },
  emailVerification: {
    autoSignInAfterVerification: true,
    sendOnSignUp: false,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      await sendEmail({
        to: user.email,
        subject: "Verify Your Email",
        html: `A request from your side was made for email verification. <br>
        Click on the link to verify your email ${url} <br>
        If it was not you, You can safely ignore this email.
        This link will expire in 1 hour`,
      });
    },
    expiresIn: 3600,
  },
  account: {
    accountLinking: {
      enabled: true,
    },
  },
  rateLimit: { enabled: true },
  advanced: {
    ipAddress: {
      ipAddressHeaders: ["cf-connecting-ip", "x-real-ip", "x-forwarded-for"],
    },
  },
  plugins: [nextCookies()],
});
