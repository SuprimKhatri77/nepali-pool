"use server";

import { auth } from "../lib/auth/auth";
import { checkAndUpdateRateLimit } from "./checkAndUpdateRateLimit";

export async function sendResetPasswordLink(email: string) {
  try {
    const allowed = await checkAndUpdateRateLimit(
      `reset-password-link:${email.toLowerCase()}`
    );
    if (!allowed) {
      return {
        messgae: "Too many reset password request. Please try again later!",
        success: false,
      };
    }

    await auth.api.requestPasswordReset({
      body: {
        email,
        redirectTo: "/login/forgot-password/reset-password",
      },
    });
    return {
      message: "A reset password link has been sent to your email!",
      success: true,
    };
  } catch (error) {
    return {
      message: "Something went wrong!",
      success: false,
    };
  }
}
