"use server";

import z from "zod";
import { getCurrentMentor } from "../../../lib/auth/helpers/getCurrentMentor";
import { db } from "../../../../lib/db";
import { mentorProfile } from "../../../../lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export type ContactFormState = {
  errors?: {
    phoneNumber?: string[];
    country?: string[];
    city?: string[];
    zipCode?: string[];
  };
  message: string;
  userId?: string;
  timestamp: number;
  success: boolean;
  inputs?: {
    phoneNumber?: string[];
    country?: string[];
    city?: string[];
    zipCode?: string[];
  };
};

export async function updateContact(
  prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const result = await getCurrentMentor();
  if (!result.success)
    return {
      success: result.success,
      message: result.message,
      timestamp: Date.now(),
    };
  const mentorRecord = result.mentorRecord;
  const userId = formData.get("userId") as string;

  if (userId !== mentorRecord.userId) {
    return {
      success: false,
      message: "Unauthorized access",
      timestamp: Date.now(),
    };
  }
  const personalSchema = z.object({
    country: z
      .string()
      .trim()
      .min(1, "Country is required")
      .nonempty()
      .regex(/^[A-Za-z]+$/, "Only alphabets A-Z or a-z are allowed"),
    city: z
      .string()
      .trim()
      .min(1, "City is required")
      .nonempty()
      .regex(/^[A-Za-z]+$/, "Only alphabets A-Z or a-z are allowed"),
    zipCode: z
      .string()
      .trim()
      .nonempty("Zip code is required")
      .regex(/^\d+$/, "Zipcode must contain only digits"),
    phoneNumber: z
      .string()
      .trim()
      .min(10, "Phone number must be more than or equal to 10 digits.")
      .max(20, "Phone number cannot exceed more than 20 digits.")
      .regex(/^\d+$/, "Phone number must contain only digits"),
  });

  const validateFields = personalSchema.safeParse({
    country: formData.get("country") as string,
    phoneNumber: formData.get("phoneNumber") as string,
    zipCode: formData.get("zipCode") as string,
    city: formData.get("city") as string,
  });

  if (!validateFields.success) {
    return {
      success: false,
      message: "Validation failed",
      errors: validateFields.error.flatten().fieldErrors,
      timestamp: Date.now(),
      inputs: Object.fromEntries(formData),
    };
  }

  const { country, zipCode, phoneNumber, city } = validateFields.data;

  try {
    await db
      .update(mentorProfile)
      .set({
        country,
        zipCode,
        phoneNumber,
        city,
        updatedAt: new Date(),
      })
      .where(eq(mentorProfile.userId, userId));

    revalidatePath("/profile");

    return {
      message: "Profile updated",
      success: true,
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error("Error: ", error);
    return {
      message: "Something went wrong",
      success: false,
      timestamp: Date.now(),
    };
  }
}
