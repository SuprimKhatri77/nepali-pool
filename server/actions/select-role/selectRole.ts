"use server";

import z from "zod";
import { db } from "../../../lib/db";
import { user } from "../../../lib/db/schema";
import { auth } from "../../lib/auth/auth";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";

export type FormState = {
  errors?: {
    role?: string[];
  };
  message: string;
  success: boolean;
  redirectTo?: string;
  timestamp: number;
};

const roleEnum = z
  .enum(["student", "mentor"])
  .refine((val) => ["student", "mentor"].includes(val), {
    message: "Invalid role, Allowed roles: Student, Mentor",
  });

export async function UpdateUserRole(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const adminEmails = (process.env.ADMIN_EMAILS?.split(",") ?? []).map(
    (email) => email.toLowerCase()
  );

  const userRole = z.object({
    role: roleEnum,
  });

  const validateField = userRole.safeParse({
    role: formData.get("role") as string,
  });

  if (!validateField.success) {
    return {
      errors: validateField.error.flatten().fieldErrors,
      message: "Error updating role",
      success: false,
      timestamp: Date.now(),
    };
  }

  const { role } = validateField.data;

  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return { message: "Unauthorized", success: false, timestamp: Date.now() };
    }

    const [userRecord] = await db
      .select()
      .from(user)
      .where(eq(user.id, session.user.id));
    if (!userRecord) {
      return { message: "Unauthorized", success: false, timestamp: Date.now() };
    }

    if (!userRecord.emailVerified) {
      return {
        message: "Email not verified",
        success: false,
        timestamp: Date.now(),
      };
    }

    if (userRecord.role !== "none") {
      return {
        message: "You already have a role",
        success: false,
        timestamp: Date.now(),
      };
    }

    const userEmail = userRecord.email.toLowerCase();
    const isAdminEmail = adminEmails.includes(userEmail);

    await db
      .update(user)
      .set({
        role: isAdminEmail ? "admin" : role,
      })
      .where(eq(user.id, session.user.id));

    if (isAdminEmail) {
      return {
        success: true,
        message: "Role updated successfully",
        timestamp: Date.now(),
        redirectTo: "/admin",
      };
    }

    if (role === "student") {
      return {
        success: true,
        message: "Role updated successfully",
        timestamp: Date.now(),
        redirectTo: "/dashboard/student",
      };
    }
    if (role === "mentor") {
      return {
        success: true,
        message: "Role updated successfully",
        timestamp: Date.now(),
        redirectTo: "/dashboard/mentor",
      };
    }

    return {
      success: true,
      message: "Role updated successfully",
      timestamp: Date.now(),
      redirectTo: "/",
    };
  } catch (error) {
    console.error("Error: ", error);
    return {
      message: "Couldn't update the role.",
      success: false,
      timestamp: Date.now(),
    };
  }
}
