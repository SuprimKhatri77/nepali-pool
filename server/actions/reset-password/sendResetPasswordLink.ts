"use server";

import { eq } from "drizzle-orm";
import { db } from "../../../lib/db";
import { user } from "../../../lib/db/schema";
import { checkAndUpdateRateLimit } from "../rate-limiting/checkAndUpdateRateLimit";
import { auth } from "../../lib/auth/auth";

type ResetPasswordLinkType =
  | { success: true; message: string }
  | { success: false; message: string };

export async function sendResetPasswordLink(
  email: string
): Promise<ResetPasswordLinkType> {
  try {
    const [userRecord] = await db
      .select()
      .from(user)
      .where(eq(user.email, email));

    if (!userRecord) {
      return { success: false, message: "User doesn't exist" };
    }

    const { allowed } = await checkAndUpdateRateLimit(
      `reset-password-link:${userRecord.id}`
    );

    if (!allowed) {
      return {
        message: "Too many reset password requests. Please try again later!",
        success: false,
      };
    }

    await auth.api.requestPasswordReset({
      body: {
        email,
        redirectTo: "/reset-password",
      },
    });

    return {
      message: "A reset password link has been sent to your email!",
      success: true,
    };
  } catch {
    // console.error("Server action error msg: ", error);
    return {
      message: "Something went wrong!",
      success: false,
    };
  }
}
