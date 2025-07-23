"use server";

import z from "zod";
import { auth } from "../lib/auth/auth";
import { APIError } from "better-auth/api";
import { db } from "../../lib/db";
import { user } from "../../lib/db/schema";
import { eq } from "drizzle-orm";

export type FormState = {
  errors?: {
    firstname?: string[];
    lastname?: string[];
    email?: string[];
    password?: string[];
    role?: string[];
  };
  message?: string;
  success?: boolean;
  redirectTo?: string;
};

const roleEnum = z
  .string()
  .refine((val) => ["none", "student", "mentor"].includes(val), {
    message: "Invalid role. Allowed roles: student or mentor.",
  }) as z.ZodType<"none" | "student" | "mentor">;
const adminEmails = process.env.ADMIN_EMAILS?.split(",") ?? [];

export async function SignUp(prevState: FormState, formData: FormData) {
  const userData = z.object({
    firstname: z
      .string()
      .min(1, "Firstname is required")
      .max(20, "Firstname must be less than 20 characters")
      .regex(/^[A-Za-z]+$/, "Firstname must contain only letters")
      .nonempty(),
    lastname: z
      .string()
      .min(1, "Lastname is required")
      .max(20, "Lastname must be less than 20 characters")
      .regex(/^[A-Za-z]+$/, "Lastname must contain only letters")
      .nonempty(),
    email: z.string().email().nonempty(),
    password: z
      .string()
      .min(1, "Password must be greater than 1 character")
      .nonempty(),
    role: roleEnum,
  });

  const validateFields = userData.safeParse({
    email: formData.get("email") as string,
    firstname: formData.get("firstname") as string,
    lastname: formData.get("lastname") as string,
    password: formData.get("password") as string,
    role: formData.get("role") as string,
  });

  if (!validateFields.success) {
    return {
      errors: validateFields.error.flatten().fieldErrors,
      message: "Validation Failed",
      success: false,
    };
  }

  const { firstname, lastname, email, password, role } = validateFields.data;

  try {
    await auth.api.signUpEmail({
      body: {
        name: `${firstname} ${lastname}`,
        email,
        password,
      },
    });

    const normalizedRole = role.toLowerCase();
    const normalizedEmail = email.toLowerCase();
    const isAdmin = adminEmails.includes(normalizedEmail);

    await db
      .update(user)
      .set({
        role: isAdmin
          ? "admin"
          : (normalizedRole as "student" | "none" | "mentor"),
      })
      .where(eq(user.email, email));

    await auth.api.sendVerificationEmail({
      body: {
        email,
      },
    });

    return {
      errors: {},
      redirectTo: `/sign-up/verify-email?email=${encodeURIComponent(
        email
      )}&from=signup`,
      message: "Signup successfull , Redirecting to verify email....",
      success: true,
    };
  } catch (error) {
    if (error instanceof APIError) {
      switch (error.status) {
        case "UNPROCESSABLE_ENTITY":
          return { success: false, message: "User already exists" };
        case "BAD_REQUEST":
          return { success: false, message: "Invalid email" };
        default:
          return { success: false, message: "Something went wrong" };
      }
    }
    throw error;
  }
}
