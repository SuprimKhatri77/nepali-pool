"use server";

import z from "zod";
import { db } from "../../../lib/db";
import { mentorProfile, studentProfile, user } from "../../../lib/db/schema";
import { auth } from "../../lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { redirectByRole } from "../../helper/redirectByrole";

export type FormState = {
  errors?: {
    role?: string[];
  };
  message?: string;
  success?: boolean;
  redirectTo?: string;
  timestamp?: number;
};

const roleEnum = z.enum(["student", "mentor", "none"]);

export async function UpdateUserRole(prevState: FormState, formData: FormData) {
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
    };
  }

  const { role } = validateField.data;

  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return { message: "Unauthorized", success: false };
    }

    const [userRecord] = await db
      .select()
      .from(user)
      .where(eq(user.id, session.user.id));
    if (!userRecord) {
      return { message: "Unauthorized", success: false };
    }

    if (!userRecord.emailVerified) {
      return { message: "Email not verified", success: false };
    }

    if (userRecord.role !== "none") {
      return { message: "You already have a role", success: false };
    }

    const userEmail = userRecord.email.toLowerCase();
    const isAdminEmail = adminEmails.includes(userEmail);

    await db
      .update(user)
      .set({
        role: isAdminEmail ? "admin" : role,
      })
      .where(eq(user.id, session.user.id));

    await redirectByRole(userRecord);

    return { success: true, message: "Redirecting...", timestamp: Date.now() };
  } catch (error) {
    console.error("Error: ", error);
    return { message: "Couldn't update the role.", success: false };
  }
}
