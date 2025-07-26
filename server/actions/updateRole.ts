"use server";

import z from "zod";
import { db } from "../../lib/db";
import { mentorProfile, studentProfile, user } from "../../lib/db/schema";
import { auth } from "../lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";

export type FormState = {
  errors?: {
    role?: string[];
  };
  message?: string;
  success?: boolean;
  redirectTo?: string;
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
      return redirect("/login");
    }

    const [userRecord] = await db
      .select()
      .from(user)
      .where(eq(user.id, session.user.id));
    if (!userRecord) {
      return redirect("/sign-up");
    }

    if (!userRecord.emailVerified) {
      return redirect(
        `/sign-up/verify-email?email=${encodeURIComponent(userRecord.email)}`
      );
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
        message: "Looks like you're an admin, Sorry for the trouble.",
        success: true,
        redirectTo: "/admin/dashboard",
      };
    }

    if (role === "mentor") {
      const [mentorProfileRecord] = await db
        .select()
        .from(mentorProfile)
        .where(eq(mentorProfile.userId, userRecord.id));
      if (!mentorProfileRecord) {
        return {
          message:
            "You've not filled onboarding form!, redirecting to onboarding....",
          success: true,
          redirectTo: `/sign-up/onboarding/mentor`,
        };
      }

      if (mentorProfileRecord.verifiedStatus === "pending") {
        return {
          message: "Role updated successfully!, Redirecting....",
          success: true,
          redirectTo: `/waitlist`,
        };
      }
      if (mentorProfileRecord.verifiedStatus === "rejected") {
        return {
          message: "Role updated successfully!, Redirecting....",
          success: true,
          redirectTo: `/rejected`,
        };
      }
      return {
        message: "Role updated successfully!, Redirecting....",
        success: true,
        redirectTo: `/dashboard/mentor`,
      };
    }

    if (role === "student") {
      const [studentProfileRecord] = await db
        .select()
        .from(studentProfile)
        .where(eq(studentProfile.userId, userRecord.id));
      if (!studentProfileRecord) {
        return {
          message:
            "You've not filled onboarding form!, redirecting to onboarding....",
          success: true,
          redirectTo: `/sign-up/onboarding/student`,
        };
      }
      return {
        message: "Role updated successfully!, Redirecting......",
        success: true,
        redirectTo: `/dashboard/student`,
      };
    }
    return {
      success: true,
      redirectTo: `${role !== "none" ? `dashboard/${role}` : "/select-role"}`,
    };
  } catch (error) {
    console.error("Error: ", error);
    return { message: "Couldn't update the role.", success: false };
  }
}
