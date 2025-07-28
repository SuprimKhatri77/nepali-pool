import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../../../lib/db";
import { user as userTable } from "../../../lib/db/schema";
import { sendEmail } from "../send-email";
import { nextCookies } from "better-auth/next-js";
import { eq } from "drizzle-orm";
import { Resend } from "resend";
import EmailVerification from "@/components/VerifyEmailMessage";

const resend = new Resend(process.env.RESEND_API_KEY as string);

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    requireEmailVerification: false,
    resetPasswordTokenExpiresIn: 600,
    sendResetPassword: async ({ user, url, token }, request) => {
      await sendEmail({
        to: user.email,
        subject: "Reset Password",
        html: `A reset password request was made from your side. <br> Click on the link to reset password ${url} <br> If it was not you, You can safely ignore this email.
              The link will expire in 10minutes.`,
      });
    },
  },
  emailVerification: {
    autoSignInAfterVerification: true,
    sendOnSignUp: false,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      const finalUrl = new URL(url);
      const [userRecord] = await db
        .select()
        .from(userTable)
        .where(eq(userTable.id, user.id));

      finalUrl.searchParams.set(
        "callbackURL",
        `${process.env.BETTER_AUTH_URL}/${
          userRecord.role !== "none"
            ? userRecord.role === "admin"
              ? `/admin`
              : `/sign-up/onboarding/${userRecord.role}`
            : "/select-role"
        }`
      );

      // Resend config for production

      // await resend.emails.send({
      //   from: "nepalipool77@gmail.com",
      //   to: user.email,
      //   subject: "Verify your email",
      //   react: EmailVerification({ name: user.name, url: String(finalUrl) }),
      // });

      await sendEmail({
        to: user.email,
        subject: "Verify Your Email",
        html: `A request from your side was made for email verification. <br>Click on the link to verify your email ${finalUrl} <br> If it was not you , You can safely ignore this email. This link will expire in 1 hour`,
      });
    },
    expiresIn: 3600,
  },
  account: {
    accountLinking: {
      enabled: true,
    },
  },
  plugins: [nextCookies()],
});
