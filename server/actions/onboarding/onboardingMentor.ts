"use server";

import z from "zod";
import { db } from "../../../lib/db";
import { eq } from "drizzle-orm";
import {
  mentorProfile,
  MentorProfileInsertType,
  user,
} from "../../../lib/db/schema";

export type FormState = {
  errors?: {
    country?: string[];
    city?: string[];
    zipCode?: string[];
    phoneNumber?: string[];
    sex?: string[];
    resume?: string[];
    citizenshipPhotoUrl?: string[];
    currentUserId?: string[];
    nationality?: string[];
    bio?: string[];
    imageUrl?: string[];
  };
  message?: string;
  success?: boolean;
  redirectTo?: string;
};

const sexEnum = z
  .enum(["male", "female", "other"])
  .refine((value) => ["male", "female", "other"].includes(value), {
    message: "Gender must be male, female or other",
  });

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
  // console.log("FormData: ", formData);

  const onboardingMentorData = z.object({
    country: z
      .string()
      .min(1, "Country is required")
      .nonempty()
      .regex(/^[A-Za-z]+$/, "Only alphabets A-Z or a-z are allowed"),
    city: z
      .string()
      .min(1, "City is required")
      .nonempty()
      .regex(/^[A-Za-z]+$/, "Only alphabets A-Z or a-z are allowed"),
    zipCode: z
      .string()
      .nonempty("Zip code is required")
      .regex(/^\d+$/, "Zipcode must contain only digits"),
    phoneNumber: z
      .string()
      .min(10, "Phone number must be more than or equal to 10 digits.")
      .max(20, "Phone number cannot exceed more than 20 digits.")
      .regex(/^\d+$/, "Phone number must contain only digits"),
    sex: sexEnum,
    resume: z.string().nonempty("Resume photo is required"),
    citizenshipPhotoUrl: z.string().nonempty("Citizenship photo is required"),
    nationality: z
      .string()
      .nonempty("nationality is required")
      .regex(/^[A-Za-z]+$/, "Only alphabets A-Z or a-z are allowed"),
    currentUserId: z.string().nonempty(),
    imageUrl: z.string().nonempty(),
    bio: z.string().nonempty(),
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
    imageUrl: formData.get("imageUrl") as string,
    bio: formData.get("bio") as string,
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
    imageUrl,
    bio,
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

    await db
      .update(user)
      .set({
        image: imageUrl,
      })
      .where(eq(user.id, userRecord.id));

    await db.insert(mentorProfile).values({
      nationality: nationality.toLowerCase(),
      country: country.toLowerCase(),
      citizenshipPhotoUrl,
      sex,
      city: city.toLowerCase(),
      phoneNumber,
      resume,
      zipCode,
      bio,
      imageUrl,
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
