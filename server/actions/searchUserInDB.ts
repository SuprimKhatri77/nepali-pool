"use server";

import { eq } from "drizzle-orm";
import { db } from "../../lib/db";
import { user } from "../../lib/db/schema";
import z from "zod";
import { checkAndUpdateRateLimit } from "./checkAndUpdateRateLimit";

export type FormState = {
  errors?: {
    email?: string[];
  };
  message?: string;
  success?: boolean;
  timestamp?: Date;
};

export async function searchUserInDB(prevState: FormState, formData: FormData) {
  const userEmail = z.object({
    email: z
      .string()
      .email("Enter a valid email!")
      .nonempty("Email is required"),
  });

  const validateField = userEmail.safeParse({
    email: formData.get("email") as string,
  });

  if (!validateField.success) {
    return {
      errors: validateField.error.flatten().fieldErrors,
      message: "Validation error",
      success: false,
    };
  }

  const { email } = validateField.data;

  try {
    const isAllowed = await checkAndUpdateRateLimit(
      `reset-password-link:${email.toLowerCase()}`
    );
    if (!isAllowed) {
      return {
        success: false,
        message: "Too many requests,Please try again later!",
      };
    }

    const data = await db.select().from(user).where(eq(user.email, email));
    if (data.length === 0) {
      return {
        errors: {
          email: ["Email not found!"],
        },
        message: "Email not found!",
        success: false,
        timestamp: new Date(),
      };
    }
    return {
      message: "A reset password link has been to your email!",
      success: true,
    };
  } catch (error) {
    console.error("Error: ", error);
    return {
      errors: {},
      message: "Something went wrong!",
      success: false,
    };
  }
}
