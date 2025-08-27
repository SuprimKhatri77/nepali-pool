"use server";

import { headers } from "next/headers";
import { db } from "../../lib/db";
import { user } from "../../lib/db/schema";
import { auth } from "../lib/auth/auth";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { checkAndUpdateRateLimit } from "./checkAndUpdateRateLimit";

export async function resendEmailVerification() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return redirect("/login");
    }

    const [userRecord] = await db
      .select()
      .from(user)
      .where(eq(user.id, session?.user.id));
    if (!userRecord) {
      return redirect("/sign-up");
    }

    if (!userRecord.role || userRecord.role === "none") {
      return redirect("/select-role");
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

    await auth.api.sendVerificationEmail({
      body: {
        email: userRecord.email,
        callbackURL: `${userRecord.role === "admin" ? "/admin" : `/sign-up/onboarding/${userRecord.role}`}`,
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
