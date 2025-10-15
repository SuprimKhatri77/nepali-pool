"use server";

import z from "zod";
import { getCurrentStudent } from "../../../lib/auth/helpers/getCurrentStudent";
import { db } from "../../../../lib/db";
import { studentProfile } from "../../../../lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export type StudentContactFormState = {
  errors?: {
    phoneNumber?: string[];
    city?: string[];
    district?: string[];
    favoriteDestination?: string[];
  };
  message: string;
  success: boolean;
  timestamp: number;
  inputs?: {
    phoneNumber?: string;
    city?: string;
    district?: string;
    favoriteDestination?: string;
  };
  userId?: string;
};

export async function updateContact(
  prevState: StudentContactFormState,
  formData: FormData
): Promise<StudentContactFormState> {
  // console.log("CONTACT FORMDATA: ", formData);
  const result = await getCurrentStudent();
  if (!result.success)
    return {
      success: result.success,
      message: result.message,
      timestamp: Date.now(),
    };
  const studentRecord = result.studentRecord;
  const userId = formData.get("userId") as string;
  if (!userId)
    return {
      success: false,
      message: "Missing required credentials",
      timestamp: Date.now(),
    };
  if (userId !== studentRecord.userId) {
    return {
      success: false,
      message: "Unauthorized attempt",
      timestamp: Date.now(),
    };
  }

  const favoriteDestination = formData.getAll(
    "favoriteDestination"
  ) as string[];
  const lowerCaseFavoriteDestinations = favoriteDestination
    .filter(Boolean)
    .map((destination) => destination.toLowerCase());

  const schema = z.object({
    favoriteDestination: z
      .array(z.string())
      .min(1, "Select at least one destination")
      .max(5, "You can select up to 5 destinations")
      .nonempty("At least one destination is required"),
    phoneNumber: z
      .string()
      .trim()
      .min(10, "Phone number must be more than or equal to 10 digits.")
      .max(20, "Phone number cannot exceed more than 20 digits.")
      .regex(/^\d+$/, "Phone number must contain only digits")
      .nonempty("Phone number is required."),
    district: z
      .string()
      .trim()
      .regex(/^[A-Za-z]+$/, "District name must contain alphabets only.")
      .nonempty("District name is required."),
    city: z
      .string()
      .trim()
      .regex(/^[A-Za-z]+$/, "City name must contain alphabets only.")
      .nonempty("City name is required."),
  });

  const validateFields = schema.safeParse({
    favoriteDestination: favoriteDestination,
    district: formData.get("district") as string,
    phoneNumber: formData.get("phoneNumber") as string,
    city: formData.get("city") as string,
  });

  if (!validateFields.success) {
    return {
      errors: validateFields.error.flatten().fieldErrors,
      success: false,
      message: "Validation failed",
      timestamp: Date.now(),
      inputs: Object.fromEntries(formData),
    };
  }

  const { city, district, phoneNumber } = validateFields.data;

  try {
    await db
      .update(studentProfile)
      .set({
        city,
        district,
        phoneNumber,
        favoriteDestination: lowerCaseFavoriteDestinations,
        updatedAt: new Date(),
      })
      .where(eq(studentProfile.userId, userId));

    revalidatePath("/profile");

    return {
      success: true,
      message: "Profile updated",
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error("Error: ", error);
    return {
      success: false,
      message: "Something went wrong",
      timestamp: Date.now(),
      inputs: Object.fromEntries(formData),
    };
  }
}
