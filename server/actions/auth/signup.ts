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
  timestamp: number;
};

const roleEnum = z
  .string()
  .refine((val) => ["none", "student", "mentor"].includes(val), {
    message: "Invalid role. Allowed roles: student or mentor.",
  }) as z.ZodType<"none" | "student" | "mentor">;
const adminEmails = process.env.ADMIN_EMAILS?.split(",") ?? [];

export async function SignUp(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  // console.log("ROLE: ", formData.get("role"));
  const userData = z.object({
    firstname: z
      .string()
      .trim()
      .min(1, "Firstname is required")
      .max(20, "Firstname must be less than 20 characters")
      .regex(/^[A-Za-z]+$/, "Firstname must contain only letters")
      .nonempty(),
    lastname: z
      .string()
      .trim()

      .min(1, "Lastname is required")
      .max(20, "Lastname must be less than 20 characters")
      .regex(/^[A-Za-z]+$/, "Lastname must contain only letters")
      .nonempty(),
    email: z.string().trim().email().nonempty(),
    password: z
      .string()
      .trim()

      .min(6, "Password must be at least 6 characters long")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^a-zA-Z0-9]/,
        "Password must contain at least one special character eg: @, #"
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
      timestamp: Date.now(),
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
              : userRecord.role === "mentor"
                ? "/dashboard/mentor"
                : "/sessions"
            : "/select-role",

        // to be set after the session
        // userRecord.role !== "none"
        //   ? userRecord.role === "admin"
        //     ? "/admin"
        //     : `/onboarding/${userRecord.role}`
        //   : "/select-role",
      },
    });

    return {
      errors: {},
      redirectTo: `/verify-email?from=signup`,
      message: "Signup successfull , Redirecting to verify email....",
      success: true,
      timestamp: Date.now(),
    };
  } catch (error) {
    if (error instanceof APIError) {
      return {
        success: false,
        message: error.message,
        timestamp: Date.now(),
        inputs: Object.fromEntries(formData),
      };
    }

    return {
      success: false,
      message: "Something went wrong",
      timestamp: Date.now(),
      inputs: Object.fromEntries(formData),
    };
    throw error;
  }
}
