"use server";

import { and, eq } from "drizzle-orm";
import { db } from "../../lib/db";
import { favorite } from "../../lib/db/schema";
import { revalidatePath } from "next/cache";

export type FormState = {
  errors?: {
    mentorId?: string[];
    studentId?: string[];
  };
  message?: string;
  success?: boolean;
};

export async function removeFavorite(prevState: FormState, formData: FormData) {
  const studentId = formData.get("studentId") as string;
  const mentorId = formData.get("mentorId") as string;

  if (!studentId || !mentorId) {
    return {
      message: "Error removing favorite, Please try again!",
      success: false,
    };
  }

  try {
    await db
      .delete(favorite)
      .where(
        and(eq(favorite.studentId, studentId), eq(favorite.mentorId, mentorId))
      );
    revalidatePath("/dashboard/student");
    return {
      message: "Added to favorite successfully!",
      success: true,
    };
  } catch (error) {
    console.error("Error: ", error);
    return {
      message: "Failed to remove from favorite.",
      success: false,
    };
  }
}
