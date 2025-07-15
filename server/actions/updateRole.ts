"use server";

import z from "zod";
import { db } from "../../lib/db";
import { user } from "../../lib/db/schema";
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
};

const roleEnum = z.enum(["student", "admin", "mentor", "none"]);

export async function UpdateUserRole(prevState: FormState, formData: FormData) {
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

    if (session) {
      const [userRecord] = await db
        .select()
        .from(user)
        .where(eq(user.id, session.user.id));
      if (userRecord.role !== "none") {
        return redirect(`/dashboard/${userRecord.role}`);
      }
      await db
        .update(user)
        .set({
          role,
        })
        .where(eq(user.id, session.user.id));
    }
  } catch (error) {
    return { error, message: "Couldn't update the role.", success: false };
  }
  return {
    errors: {},
    message: "Updated the role successfully, redirecting......",
    success: true,
  };
}
