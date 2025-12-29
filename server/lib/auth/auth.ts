import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../../../lib/db";
import { sendEmail } from "../send-email";
import { nextCookies } from "better-auth/next-js";
import { Resend } from "resend";
import * as schema from "../../../lib/db/schema";
import { EmailVerification } from "@/components/VerifyEmailMessage";
import { PasswordReset } from "@/modules/email-templates/reset-password-email";

const resend = new Resend(process.env.RESEND_API_KEY as string);

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  baseURL:
    process.env.NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_BETTER_AUTH_URL
      : "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET,
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    requireEmailVerification: false,
    resetPasswordTokenExpiresIn: 300,
    sendResetPassword: async ({ user, url, token }, request) => {
      // await sendEmail({
      //   to: user.email,
      //   subject: "Reset Your Password",
      //   html: `
      //     <div style="background-color: #f9f9f9; padding: 24px;">
      //       <div style="max-width: 480px; margin: auto; background: #ffffff; border-radius: 8px; padding: 24px; box-shadow: 0 1px 5px rgba(0,0,0,0.1);">

      //         <!-- Logo -->
      //         <div style="text-align: center; margin-bottom: 24px;">
      //           <img src="https://nepalipool.vercel.app/logo.png" alt="NepaliPool Logo" style="height: 50px;" />
      //         </div>

      //         <h2 style="text-align: center; color: #10b981; margin-bottom: 16px;">Reset Your Password</h2>

      //         <p style="font-size: 16px; color: #333; line-height: 1.5;">
      //           Hello <strong>${user.name || "Student"}</strong>,<br><br>
      //           We received a request to reset your password. Click the button below to set a new password:
      //         </p>

      //         <div style="text-align: center; margin: 24px 0;">
      //           <a href="${url}"
      //              style="background-color: #10b981; color: #ffffff; text-decoration: none;
      //                     padding: 12px 24px; border-radius: 6px; font-weight: bold; display: inline-block;">
      //             Reset Password
      //           </a>
      //         </div>

      //         <p style="font-size: 14px; color: #555; line-height: 1.4;">
      //           This link will expire in 1 hour. If you didn’t request this, you can ignore this email safely.
      //         </p>

      //         <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 24px 0;" />

      //         <p style="font-size: 13px; color: #999; text-align: center;">
      //           Need help? Reply to this email.<br />
      //           © ${new Date().getFullYear()} NepaliPool
      //         </p>
      //       </div>
      //     </div>
      //   `,
      // });
      await resend.emails.send({
        from: "Nepalipool <noreply@nepalipool.com>",
        to: user.email,
        subject: "Reset your password",
        react: PasswordReset({ url, name: user.name }),
      });
    },
  },
  emailVerification: {
    autoSignInAfterVerification: true,
    sendOnSignUp: false,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      // await sendEmail({
      //   to: user.email,
      //   subject: "Verify Your Email",
      //   html: `
      //   <div style="background-color: #f9f9f9; padding: 24px;">
      //     <div style="max-width: 480px; margin: auto; background: #ffffff; border-radius: 8px; padding: 24px; box-shadow: 0 1px 5px rgba(0,0,0,0.1);">

      //       <!-- Logo -->
      //       <div style="text-align: center; margin-bottom: 24px;">
      //         <img src="https://nepalipool.vercel.app/logo.png" alt="NepaliPool Logo" style="height: 50px;" />
      //       </div>

      //       <h2 style="text-align: center; color: #10b981; margin-bottom: 16px;">Verify Your Email</h2>

      //       <p style="font-size: 16px; color: #333; line-height: 1.5;">
      //         Hello <strong>${user.name || "Student"}</strong>,<br><br>
      //         We received a request to verify your email address. Click the button below to confirm your account.
      //       </p>

      //       <div style="text-align: center; margin: 24px 0;">
      //         <a href="${url}"
      //            style="background-color: #10b981; color: #ffffff; text-decoration: none;
      //                   padding: 12px 24px; border-radius: 6px; font-weight: bold; display: inline-block;">
      //           Verify Email
      //         </a>
      //       </div>

      //       <p style="font-size: 14px; color: #555; line-height: 1.4;">
      //         This link will expire in 1 hour. If you didn’t request this, you can ignore this email safely.
      //       </p>

      //       <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 24px 0;" />

      //       <p style="font-size: 13px; color: #999; text-align: center;">
      //         Need help? Reply to this email.<br />
      //         © ${new Date().getFullYear()} NepaliPool
      //       </p>
      //     </div>
      //   </div>
      // `,
      // });

      const name = user.name;
      await resend.emails.send({
        from: "Nepalipool <noreply@nepalipool.com>",
        to: user.email,
        subject: "Verify your email",
        react: EmailVerification({ url, name }),
      });
    },
    expiresIn: 86400,
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
