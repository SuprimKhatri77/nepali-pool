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
    middlename?:string[];
    email?: string[];
    password?: string[];
    role?: string[];
    confirmPassword?: string[];
  };
  message?: string;
  success?: boolean;
  redirectTo?: string;
  inputs?: {
    firstname?: string;
    middlename?:string;
    lastname?: string;
    email?: string;
    password?: string;
    role?: string;
    confirmPassword?: string;
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
  console.log("formdata: ",formData)
  const userData = z.object({
    firstname: z
      .string()
      .trim()
      .min(1, "Firstname is required")
      .max(20, "Firstname must be less than 20 characters")
      .regex(/^[A-Za-z]+$/, "Firstname must contain only letters")
      .nonempty(),
    middlename: z
      .string()
      .trim()
     
      .optional(),
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
        "Use  at least one special character eg: @, # in Password"
      ),
    confirmPassword: z.string(),
    role: roleEnum,
  });

  const validateFields = userData.safeParse({
    email: formData.get("email") as string,
    firstname: formData.get("firstname") as string,
    middlename: formData.get("middlename") as string,
    lastname: formData.get("lastname") as string,
    password: formData.get("password") as string,
    role: formData.get("role") as string,
    confirmPassword: formData.get("confirmPassword") as string,
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

  const { firstname, middlename,lastname, email, password, role, confirmPassword } =
    validateFields.data;

  if (password !== confirmPassword) {
    return {
      success: false,
      message: "Password didn't match.",
      inputs: Object.fromEntries(formData),
      timestamp: Date.now(),
    };
  }
  try {
    await auth.api.signUpEmail({
      body: {
        name: middlename ?  `${firstname.toLowerCase()} ${middlename.toLowerCase()} ${lastname.toLowerCase()}` : `${firstname.toLowerCase()} ${lastname.toLowerCase()}` ,
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
                : "/mentors"
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
    console.log("error: ",error)
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
  }
}
