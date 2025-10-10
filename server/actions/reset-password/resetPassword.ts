"use server";

import { auth } from "../../lib/auth/auth";
import { db } from "../../../lib/db";
import { verification } from "../../../lib/db/schema";
import { eq } from "drizzle-orm";

export async function resetPassword(newPassword: string, token: string) {
  if (!token) {
    return { success: false, message: "Missing token" };
  }
  try {
    await auth.api.resetPassword({
      body: {
        newPassword,
        token,
      },
    });

    await db
      .update(verification)
      .set({
        consumed: true,
        updatedAt: new Date(),
      })
      .where(eq(verification.identifier, `reset-password:${token}`));
    return {
      message: "Password reset successfully!",
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
