"use server";

import { redirect } from "next/navigation";
import { auth } from "../lib/auth/auth";
import { checkAndUpdateRateLimit } from "./checkAndUpdateRateLimit";
import { headers } from "next/headers";
import { db } from "../../lib/db";
import { user } from "../../auth-schema";
import { eq } from "drizzle-orm";

export async function resetPassword(newPassword: string, token: string) {
  if (!token) {
    return redirect("/login/forgot-password?error=missing_token");
  }
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
      .where(eq(user.id, session.user.id));
    if (!userRecord) {
      return redirect("/sign-up");
    }

    const allowed = await checkAndUpdateRateLimit(
      `reset-password:${userRecord.id}`
    );

    if (!allowed) {
      return {
        message: "Too many reset password attempts. Try again later!",
        success: false,
      };
    }
    await auth.api.resetPassword({
      body: {
        newPassword,
        token,
      },
    });
    return {
      message: "Password reseted successfully!",
      success: true,
      redirectTo: "/login",
    };
  } catch (error) {
    return {
      message: "Something went wrong!",
      success: true,
    };
  }
}
