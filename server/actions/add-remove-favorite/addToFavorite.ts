"use server";

import { revalidatePath } from "next/cache";
import { db } from "../../../lib/db";
import { favorite, FavoriteInsertType } from "../../../lib/db/schema";
import { getCurrentStudent } from "../../lib/auth/helpers/getCurrentStudent";

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
    const result = await getCurrentStudent();
    if (!result.success) return result;

    const currentStudentId = result.studentRecord.userId;

    if (currentStudentId !== studentId) {
      return { message: "Unauthorized, student ID mismatch", success: false };
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
  } catch (error: unknown) {
    console.error("Error: ", error);
    if(error instanceof Error){

      if (error.message.includes("Duplicate Key")) {
        return { message: "Mentor is already favorited", success: false };
      }
      return {
        message: "Error adding to favorite!",
        success: false,
      };
    }
  }
}
