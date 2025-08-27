"use server";

import { auth } from "../lib/auth/auth";
import { checkAndUpdateRateLimit } from "./checkAndUpdateRateLimit";

export async function sendResetPasswordLink(email: string) {
  try {
    const allowed = await checkAndUpdateRateLimit(
      `reset-password-link:${email.toLowerCase()}`
    );
<<<<<<< HEAD
    if (!allowed) {
      return {
        messgae: "Too many reset password request. Please try again later!",
=======

    if (!allowed) {
      return {
        message: "Too many reset password requests. Please try again later!", // Fixed typo: "messgae" -> "message"
>>>>>>> main
        success: false,
      };
    }

    await auth.api.requestPasswordReset({
      body: {
        email,
        redirectTo: "/login/forgot-password/reset-password",
      },
    });
<<<<<<< HEAD
=======

>>>>>>> main
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
