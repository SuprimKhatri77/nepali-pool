"use server";
import { auth } from "../../lib/auth/auth";
import { checkAndUpdateRateLimit } from "../../actions/rate-limiting/checkAndUpdateRateLimit";

export async function sendResetPasswordLink(email: string) {
  try {
    const allowed = await checkAndUpdateRateLimit(
      `reset-password-link:${email.toLowerCase()}`
    );

    if (!allowed) {
      return {
        message: "Too many reset password requests. Please try again later!", // Fixed typo: "messgae" -> "message"
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
