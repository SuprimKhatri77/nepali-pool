"use server";

import z from "zod";
import { auth } from "../../lib/auth/auth";
import { APIError } from "better-auth/api";
import { db } from "../../../lib/db";
import { user } from "../../../lib/db/schema";
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
  inputs?: {
    firstname?: string;
    lastname?: string;
    email?: string;
    password?: string;
    role?: string;
  };
};

const roleEnum = z
  .string()
  .refine((val) => ["none", "student", "mentor"].includes(val), {
    message: "Invalid role. Allowed roles: student or mentor.",
  }) as z.ZodType<"none" | "student" | "mentor">;
const adminEmails = process.env.ADMIN_EMAILS?.split(",") ?? [];

export async function SignUp(prevState: FormState, formData: FormData) {
  // console.log("ROLE: ", formData.get("role"));
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
      .min(8, "Password must be at least 8 characters long")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^a-zA-Z0-9]/,
        "Password must contain at least one special character"
      ),

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
    const inputs = Object.fromEntries(formData.entries());
    return {
      errors: validateFields.error.flatten().fieldErrors,
      message: "Validation Failed",
      success: false,
      inputs,
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

    const [userRecord] = await db
      .update(user)
      .set({
        role: isAdmin
          ? "admin"
          : (normalizedRole as "student" | "none" | "mentor"),
      })
      .where(eq(user.email, email))
      .returning();

    await auth.api.sendVerificationEmail({
      body: {
        email,
        callbackURL:
          userRecord.role !== "none"
            ? userRecord.role === "admin"
              ? "/admin"
              : `/onboarding/${userRecord.role}`
            : "/select-role",
      },
    });

    return {
      errors: {},
      redirectTo: `/verify-email?from=signup`,
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
