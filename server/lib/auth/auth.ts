import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../../../lib/db";
import { sendEmail } from "../send-email";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url, token }, request) => {
      await sendEmail({
        to: user.email,
        subject: "Reset Password",
        html: `A reset password request was made from your side. <br> Click on the link to reset password ${url} <br> If it was not you, You can safely ignore this email.`,
      });
    },
  },
  emailVerification: {
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      const finalUrl = new URL(url);

      finalUrl.searchParams.set(
        "callbackURL",
        `${process.env.BETTER_AUTH_URL}/sign-up/onboarding`
      );
      await sendEmail({
        to: user.email,
        subject: "Verify your email",
        html: `A request from your side was made for email verification. <br>Click on the link to verify your email ${finalUrl} <br> If it was not you , You can safely ignore this email.`,
      });
    },
  },
  account: {
    accountLinking: {
      enabled: true,
    },
  },
  plugins: [nextCookies()],
});
