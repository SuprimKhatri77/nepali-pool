"use server";

import { auth } from "../../lib/auth/auth";
import { checkAndUpdateRateLimit } from "../../actions/rate-limiting/checkAndUpdateRateLimit";
import { headers } from "next/headers";
import { db } from "../../../lib/db";
import { user } from "../../../lib/db/schema";
import { eq } from "drizzle-orm";
import { getCallbackUrl } from "../../lib/auth/helpers/getCallbackUrl";

export async function resendEmailVerification() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session) {
      return { success: false, message: "No session found for the user!" };
    }
    const [userRecord] = await db
      .select()
      .from(user)
      .where(eq(user.id, session.user.id));
    if (!userRecord) {
      return { success: false, message: "User doesn't exist" };
    }

    if (userRecord.emailVerified) {
      return { success: false, message: "Email already verified" };
    }

    const allowed = await checkAndUpdateRateLimit(
      `resend-verification:${userRecord.id}`
    );

    if (!allowed) {
      return {
        message: "Too many request. Please try again later.",
        success: false,
      };
    }

    const url = await getCallbackUrl(userRecord);

    await auth.api.sendVerificationEmail({
      body: {
        email: userRecord.email,
        callbackURL: url,
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
