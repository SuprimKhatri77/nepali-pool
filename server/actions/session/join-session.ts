"use server";

import z from "zod";
import { db } from "../../../lib/db";
import { meetingSession } from "../../../lib/db/schema";
import {  revalidateTag } from "next/cache";
import { getCurrentUser } from "../../lib/auth/helpers/getCurrentUser";

export type SessionFormState = {
  errors?: {
    name?: string[];
    email?: string[];
    city?: string[];
    question?: string[];
  };
  userId?: string;
  success: boolean;
  message: string;
  timestamp: number;
  inputs?: {
    name?: string;
    email?: string;
    city?: string;
    question?: string;
  };
};

export async function joinSession(
  prevState: SessionFormState,
  formData: FormData
): Promise<SessionFormState> {
  const result = await getCurrentUser();
  if (!result.success) {
    return {
      success: false,
      message: result.message,
      timestamp: Date.now(),
    };
  }

  const userId = formData.get("userId") as string;
  if (userId !== result.userRecord.id) {
    return {
      success: false,
      message: "Unauthorized",
      timestamp: Date.now(),
    };
  }
  if (result.userRecord.role !== "student") {
    return {
      success: false,
      message: "Invalid role",
      timestamp: Date.now(),
    };
  }

  const sessionSchema = z.object({
    name: z.string().trim().min(1).nonempty(),
    email: z.string().trim().email().nonempty(),
    city: z.string().trim().min(1).nonempty(),
    question: z.string().trim().optional(),
  });

  const validateFields = sessionSchema.safeParse({
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    city: formData.get("city") as string,
    question: formData.get("question") as string,
  });

  if (!validateFields.success) {
    return {
      success: false,
      message: "Validation failed",
      timestamp: Date.now(),
      errors: validateFields.error.flatten().fieldErrors,
      inputs: Object.fromEntries(formData),
    };
  }

  const { name, email, city, question } = validateFields.data;

  try {
    await db.insert(meetingSession).values({
      name,
      email,
      city,
      studentId: userId,
      question: question ?? null,
    });

    revalidateTag("user_meeting_data_tag", "max");
    return {
      success: true,
      message: "Signed up for session succesfully",
      timestamp: Date.now(),
    };
  } catch (error) {
    console.log("Error: ", error);
    return {
      success: false,
      message: "Something went wrong",
      timestamp: Date.now(),
      inputs: Object.fromEntries(formData),
    };
  }
}
