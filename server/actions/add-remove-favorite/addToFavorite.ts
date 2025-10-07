"use server";

import { revalidatePath } from "next/cache";
import { db } from "../../../lib/db";
import { favorite, FavoriteInsertType, user } from "../../../lib/db/schema";
import { auth } from "../../lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";

export type FormState = {
  errors?: {
    studentId?: string[];
    mentorId?: string[];
  };
  message?: string;
  success?: boolean;
};

export async function addToFavorite(prevState: FormState, formData: FormData) {
  const studentId = formData.get("studentId") as string;
  const mentorId = formData.get("mentorId") as string;

  if (!studentId || !mentorId) {
    return {
      errors: {},
      message: "No Student ID or Mentor ID provided",
      success: false,
    };
  }
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session) {
      return { message: "UNAUTHORIZED!", success: false };
    }
    const [userRecord] = await db
      .select()
      .from(user)
      .where(eq(user.id, session.user.id));
    if (!userRecord) {
      return { message: "User doesn't exist.", success: false };
    }
    if (!userRecord.emailVerified) {
      return { message: "User's email is not verified", success: false };
    }
    if (!userRecord.role) {
      return { message: "Role not found for the user!", success: false };
    }
    if (userRecord.role === "mentor") {
      return {
        message: "Mentors cannot favorite other mentors.",
        success: false,
      };
    }

    await db.insert(favorite).values({
      studentId,
      mentorId,
      createdAt: new Date(),
    } satisfies FavoriteInsertType);
    revalidatePath("/dashboard/student");
    return {
      message: "Mentor added to favorite successfully!",
      success: true,
    };
  } catch (error) {
    console.error("Error: ", error);
    return {
      message: "Error adding to favorite, Please try again later!",
      success: false,
    };
  }
}
