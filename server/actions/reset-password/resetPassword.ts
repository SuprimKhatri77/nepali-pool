"use server";

import { auth } from "../../lib/auth/auth";
import { db } from "../../../lib/db";
import { verification } from "../../../lib/db/schema";
import { eq } from "drizzle-orm";
import z from "zod";

type ResetPassword =
  | { success: true; message: string; redirectTo: string }
  | {
      success: false;
      error?: { newPassword: string[] | undefined };
      message: string;
    };

export async function resetPassword(
  newPassword: string,
  token: string
): Promise<ResetPassword> {
  if (!token) {
    return { success: false, message: "Missing a unique identifier" };
  }
  const schema = z.object({
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^a-zA-Z0-9]/,
        "Password must contain at least one special character"
      ),
  });

  const validatePassword = schema.safeParse({
    newPassword,
  });

  if (!validatePassword.success) {
    return {
      success: false,
      error: {
        newPassword: validatePassword.error.flatten().fieldErrors.newPassword,
      },
      message: "Validation failed",
    };
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
  } catch {
    return {
      message: "Something went wrong!",
      success: false,
    };
  }
}
