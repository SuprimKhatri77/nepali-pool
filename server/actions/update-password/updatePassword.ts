"use server";

import z from "zod";
import { auth } from "../../lib/auth/auth";
import { headers } from "next/headers";
import { APIError } from "better-auth/api";

type UpdatePasswordType =
  | { success: true; message: string }
  | {
      success: false;
      message: string;
      error: { newPassword?: string[] | undefined };
    };

export async function updatePassword(
  currentPassword: string,
  newPassword: string
): Promise<UpdatePasswordType> {
  const passwordSchema = z.object({
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

  const validatePassword = passwordSchema.safeParse({ newPassword });
  if (!validatePassword.success) {
    return {
      error: validatePassword.error.flatten().fieldErrors,
      message: "Password Validation Failed",
      success: false,
    };
  }

  try {
    await auth.api.changePassword({
      body: {
        currentPassword,
        newPassword,
      },
      headers: await headers(),
    });

    return {
      success: true,
      message: "Password updated successfully",
    };
  } catch (error) {
    console.error("Error: ", error);

    if (error instanceof APIError) {
      switch (error.status) {
        case "BAD_REQUEST":
          return {
            success: false,
            message: "Incorrect current password",
            error: { newPassword: ["Incorrect current password"] },
          };
        default:
          return {
            success: false,
            message: "Something went wrong",
            error: { newPassword: [""] },
          };
      }
    }
    return {
      success: false,
      message: "Something went wrong",
      error: { newPassword: [""] },
    };
  }
}
