"use server";

import z from "zod";
import { db } from "../../../lib/db";
import { eq } from "drizzle-orm";
import {
  mentorProfile,
  MentorProfileInsertType,
  user,
} from "../../../lib/db/schema";
import { getCurrentUser } from "../../lib/auth/helpers/getCurrentUser";

export type FormState = {
  errors?: {
    country?: string[];
    city?: string[];
    zipCode?: string[];
    phoneNumber?: string[];
    sex?: string[];
    resume?: string[];
    // citizenshipPhotoUrl?: string[];
    currentUserId?: string[];
    nationality?: string[];
    bio?: string[];
    imageUrl?: string[];
  };
  message?: string;
  success?: boolean;
  redirectTo?: string;
  inputs?: {
    country?: string;
    city?: string;
    zipCode?: string;
    phoneNumber?: string;
    sex?: string;
    resume?: string;
    // citizenshipPhotoUrl?: string;
    currentUserId?: string;
    nationality?: string;
    bio?: string;
    imageUrl?: string;
  };
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
  console.log("FORMDATA: ", formData);
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
      .trim()
      .min(1, "Country is required")
      .nonempty()
      .regex(/^[A-Za-z ]+$/, "Only alphabets and spaces are allowed"),

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
    sex: sexEnum,
    resume: z.string().nonempty("Resume photo is required"),
    // citizenshipPhotoUrl: z.string().nonempty("Citizenship photo is required"),
    nationality: z
      .string()
      .trim()
      .nonempty("nationality is required")
      .regex(/^[A-Za-z]+$/, "Only alphabets A-Z or a-z are allowed"),
    currentUserId: z.string().nonempty(),
    imageUrl: z.string().nonempty(),
    bio: z.string().trim().nonempty(),
  });

  const validateFields = onboardingMentorData.safeParse({
    country: formData.get("country") as string,
    city: formData.get("city") as string,
    zipCode: formData.get("zipCode") as string,
    phoneNumber: formData.get("phoneNumber") as string,
    sex: formData.get("sex") as string,
    resume: formData.get("resume") as string,
    // citizenshipPhotoUrl: formData.get("citizenshipPhotoUrl") as string,
    currentUserId: formData.get("currentUserId") as string,
    nationality: formData.get("nationality") as string,
    imageUrl: formData.get("imageUrl") as string,
    bio: formData.get("bio") as string,
  });

  if (!validateFields.success) {
    console.error(
      "validation error: ",
      validateFields.error.flatten().fieldErrors
    );
    return {
      errors: validateFields.error.flatten().fieldErrors,
      message: "Validation Error",
      success: false,
      inputs: Object.fromEntries(formData),
    };
  }

  const {
    country,
    city,
    sex,
    resume,
    // citizenshipPhotoUrl,
    currentUserId,
    nationality,
    phoneNumber,
    zipCode,
    imageUrl,
    bio,
  } = validateFields.data;

  try {
    const result = await getCurrentUser();
    if (!result.success) return result;

    const userRecord = result.userRecord;

    if (userRecord.role !== "mentor") {
      return { success: false, message: "Access denied, Not a Mentor" };
    }

    const existingMentorProfile = await db.query.mentorProfile.findFirst({
      where: (fields, { eq }) => eq(mentorProfile.userId, userRecord.id),
    });
    if (existingMentorProfile) {
      return { success: false, message: "Mentor already onboarded" };
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
      // citizenshipPhotoUrl,
      sex,
      city: city.toLowerCase(),
      phoneNumber,
      resume,
      zipCode,
      bio,
      imageUrl,
      verifiedStatus: "pending",
      userId: currentUserId,
      createdAt: new Date(),
      updatedAt: new Date(),
    } satisfies MentorProfileInsertType);

    return {
      errors: {},
      message: "Onboarding Form validated successfully!",
      success: true,
      redirectTo: `/waitlist`,
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
