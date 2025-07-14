"use server";

import z from "zod";
import { auth } from "../lib/auth/auth";
import { APIError } from "better-auth/api";
import { db } from "../../lib/db";
import { eq } from "drizzle-orm";
import { user } from "../../lib/db/schema";
import { redirect } from "next/navigation";

export type FormState = {
  errors?: {
    email?: string[];
    password?: string[];
  };
  message?: string;
  success?: boolean;
  timestamp?: number;
};

export async function SignIn(prevState: FormState, formData: FormData) {
  const userData = z.object({
    email: z.string().email().nonempty(),
    password: z.string().min(1, "Password is required").nonempty(),
  });

  const validateFields = userData.safeParse({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  });

  if (!validateFields.success) {
    return {
      errors: validateFields.error.flatten().fieldErrors,
      message: "Failed to login.",
      success: false,
      timestamp: Date.now(),
    };
  }

  const { email, password } = validateFields.data;

  try {
    await auth.api.signInEmail({
      body: {
        email,
        password,
      },
    });
  } catch (error) {
    if (error instanceof APIError) {
      switch (error.status) {
        case "UNPROCESSABLE_ENTITY":
          return {
            success: false,
            message: "Incorrect password",
            errors: {
              password: ["Incorrect password"],
            },
            timestamp: Date.now(),
          };
        case "BAD_REQUEST":
          return {
            success: false,
            message: "Invalid email",
            errors: {
              email: ["Invalid email"],
            },
            timestamp: Date.now(),
          };
        default:
          return {
            success: false,
            message: error.body?.message ?? "Something went wrong",
            errors: {},
            timestamp: Date.now(),
          };
      }
    }
    throw error;
  }

  const [userRecord] = await db
    .select()
    .from(user)
    .where(eq(user.email, email));

  if (!userRecord) {
    return {
      success: false,
      message: "User not found after login",
    };
  }
  if (userRecord?.role === "student") {
    return redirect("/dashboard/student");
  } else if (userRecord?.role === "mentor") {
    return redirect("/dashboard/mentor");
  } else if (userRecord?.role === "admin") {
    return redirect("/admin");
  } else {
    return redirect("/select-role");
  }
}
