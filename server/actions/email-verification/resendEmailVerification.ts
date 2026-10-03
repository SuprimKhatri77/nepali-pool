"use server";

import { auth } from "../../lib/auth/auth";
import { checkAndUpdateRateLimit } from "../../actions/rate-limiting/checkAndUpdateRateLimit";
import { getViewer } from "../../lib/auth/viewer";

export async function resendEmailVerification() {
  try {
    const viewer = await getViewer();
    if (viewer.status === "anonymous") {
      return { success: false, message: "No session found for the user!" };
    }
    if (viewer.status === "invalid") {
      return { success: false, message: "User doesn't exist" };
    }
    if (viewer.status !== "unverified") {
      return { success: false, message: "Email already verified" };
    }
    const userRecord = viewer.user;

    const { allowed } = await checkAndUpdateRateLimit(
      `resend-verification:${userRecord.id}`
    );

    if (!allowed) {
      return {
        message: "Too many request. Please try again later.",
        success: false,
      };
    }

    await auth.api.sendVerificationEmail({
      body: {
        email: userRecord.email,
        // /dashboard sends the (now verified) user on to wherever they belong.
        callbackURL: "/dashboard",
      },
    });

    return {
      message: "A verification link has been sent to your email.",
      success: true,
    };
  } catch (error) {
    console.error("Error: ", error);
    return {
      message: "Something went wrong!",
      success: false,
    };
  }
}
