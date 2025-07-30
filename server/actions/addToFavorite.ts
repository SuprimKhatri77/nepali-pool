"use server";

import { revalidatePath } from "next/cache";
import { db } from "../../lib/db";
import { favorite, FavoriteInsertType } from "../../lib/db/schema";

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
    await db.insert(favorite).values({
      studentId,
      mentorId,
      createdAt: new Date(),
    } satisfies FavoriteInsertType);
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
