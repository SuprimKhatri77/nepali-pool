"use server";

import z from "zod";
import { db } from "../../lib/db";
import { eq } from "drizzle-orm";
import {
  mentorProfile,
  MentorProfileInsertType,
  user,
} from "../../lib/db/schema";

export type FormState = {
  errors?: {
    country?: string[];
    city?: string[];
    zipcode?: string[];
    phoneNumber?: string[];
    sex?: string[];
    resume?: string[];
    citizenshipPhotoUrl?: string[];
    currentUserId?: string[];
    nationality?: string[];
  };
  message?: string;
  success?: boolean;
  redirectTo?: string;
};

export async function OnboardingMentor(
  prevState: FormState,
  formData: FormData
) {
  const userId = formData.get("currentUserId") as string;

  if (!userId) {
    return {
      errors: {},
      message: "No user id found!",
      success: false,
      redirectTo: "/login",
    };
  }

  const onboardingMentorData = z.object({
    country: z.string().min(1, "Country is required").nonempty(),
    city: z.string().min(1, "City is required").nonempty(),
    zipCode: z.string().nonempty("Zip code is required").regex(/^\d+$/),
    phoneNumber: z
      .string()
      .min(10, "Phone number must be more than or equal to 10 digits.")
      .max(20, "Phone number cannot exceed more than 20 digits.")
      .regex(/^\d+$/, "Phone number must contain only digits"),
    sex: z.string().min(1, "sex is required").nonempty(),
    resume: z.string().nonempty("Resume photo is required"),
    citizenshipPhotoUrl: z.string().nonempty("Citizenship photo is required"),
    nationality: z.string().nonempty("nationality is required"),
    currentUserId: z.string().nonempty(),
  });

  const validateFields = onboardingMentorData.safeParse({
    country: formData.get("country") as string,
    city: formData.get("city") as string,
    zipCode: formData.get("zipCode") as string,
    phoneNumber: formData.get("phoneNumber") as string,
    sex: formData.get("sex") as string,
    resume: formData.get("resume") as string,
    citizenshipPhotoUrl: formData.get("citizenshipPhotoUrl") as string,
    currentUserId: formData.get("currentUserId") as string,
    nationality: formData.get("nationality") as string,
  });

  if (!validateFields.success) {
    return {
      errors: validateFields.error.flatten().fieldErrors,
      message: "Validation Error",
      success: false,
    };
  }

  const {
    country,
    city,
    sex,
    resume,
    citizenshipPhotoUrl,
    currentUserId,
    nationality,
    phoneNumber,
    zipCode,
  } = validateFields.data;

  try {
    const [userRecord] = await db
      .select()
      .from(user)
      .where(eq(user.id, currentUserId));
    if (!userRecord) {
      return {
        errors: {},
        message: "User not found!",
        success: false,
        redirectTo: "/sign-up",
      };
    }
    await db.insert(mentorProfile).values({
      nationality,
      country,
      citizenshipPhotoUrl,
      sex,
      city,
      phoneNumber,
      resume,
      zipCode,
      userId: currentUserId,
      createdAt: new Date(),
      updatedAt: new Date(),
    } satisfies MentorProfileInsertType);

    return {
      errors: {},
      message: "Onboarding Form validated successfully!",
      success: true,
      redirectTo: `/dashboard/${userRecord.role}`,
    };
  } catch (error) {
    console.error("Error: ", error);
    return {
      errors: {},
      message: "Error parsing the form data!",
      success: false,
    };
  }
}
