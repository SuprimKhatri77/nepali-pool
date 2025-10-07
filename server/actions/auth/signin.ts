"use server";

import z from "zod";
import { auth } from "../../lib/auth/auth";
import { APIError } from "better-auth/api";
import { db } from "../../../lib/db";
import { eq } from "drizzle-orm";
import { mentorProfile, studentProfile, user } from "../../../lib/db/schema";
import { redirect } from "next/navigation";

export type FormState = {
  errors?: {
    email?: string[];
    password?: string[];
  };
  message?: string;
  success?: boolean;
  timestamp?: number;
  redirectTo?: string;
  inputs?: {
    email?: string;
    password?: string;
  };
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
      inpus: Object.fromEntries(formData.entries()),
    };
  }

  const { email, password } = validateFields.data;

  try {
    const [userRecord] = await db
      .select()
      .from(user)
      .where(eq(user.email, email));

    if (!userRecord) {
      return {
        success: false,
        message: "User doesn't exist",
        errors: {
          email: ["User doesn't exist"],
        },
        timestamp: Date.now(),
      };
    }
    await auth.api.signInEmail({
      body: {
        email,
        password,
      },
    });

    if (!userRecord.emailVerified) {
      return {
        redirectTo: `/sign-up/verify-email`,
        timestamp: Date.now(),
      };
    }

    if (userRecord.role === "student") {
      const [studentProfileRecord] = await db
        .select()
        .from(studentProfile)
        .where(eq(studentProfile.userId, userRecord.id));

      if (!studentProfileRecord) {
        return redirect("/sign-up/onboarding/student");
      }

      return redirect("/dashboard/student");
    } else if (userRecord.role === "mentor") {
      const [mentorProfileRecord] = await db
        .select()
        .from(mentorProfile)
        .where(eq(mentorProfile.userId, userRecord.id));
      if (!mentorProfileRecord) {
        return redirect("/sign-up/onboarding/mentor");
      }
      if (mentorProfileRecord.verifiedStatus === "pending") {
        return redirect("/waitlist");
      }
      if (mentorProfileRecord.verifiedStatus === "rejected") {
        return redirect("/rejected");
      }
      return redirect("/dashboard/mentor");
    } else if (userRecord.role === "admin") {
      return redirect("/admin");
    } else {
      return redirect("/select-role");
    }
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
            message: "Invalid email or password",
            errors: {
              email: ["Invalid email or password"],
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
}
