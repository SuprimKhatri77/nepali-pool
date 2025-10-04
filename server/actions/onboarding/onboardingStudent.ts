"use server";

import z from "zod";
import { db } from "../../../lib/db";
import {
  studentProfile,
  user,
  type StudentProfileInsertType,
} from "../../../lib/db/schema";
import { eq } from "drizzle-orm";

export type FormState = {
  errors?: {
    imageUrl?: string[];
    bio?: string[];
    favoriteDestination?: string[];
    district?: string[];
    phoneNumber?: string[];
    sex?: string[];
    city?: string[];
  };
  message?: string;
  success?: boolean;
  redirectTo?: string;
  inputs?: {
    imageUrl?: string;
    bio?: string;
    favoriteDestination?: string;
    district?: string;
    phoneNumber?: string;
    sex?: string;
    city?: string;
  };
};

const sexEnum = z
  .enum(["male", "female", "other"])
  .refine((value) => ["male", "female", "other"].includes(value), {
    message: "Gender must be male, female or other",
  });

export default async function studentOnboarding(
  prevState: FormState,
  formData: FormData
) {
  const userId = formData.get("userId") as string;

  if (!userId) {
    return {
      errors: {},
      message: "User not found!",
      success: false,
    };
  }

  const favoriteDestinations = formData.getAll(
    "favoriteDestination"
  ) as string[];

  const lowerCaseFavoriteDestinations = favoriteDestinations
    .filter(Boolean)
    .map((destination) => destination.toLowerCase());

  const onboardingData = z.object({
    imageUrl: z.string().nonempty("Image cannot be empty"),
    bio: z.string().min(1).nonempty("Bio is required"),
    favoriteDestination: z
      .array(z.string())
      .min(1, "Select at least one destination")
      .max(5, "You can select up to 5 destinations")
      .nonempty("At least one destination is required"),
    phoneNumber: z
      .string()
      .min(10, "Phone number must be more than or equal to 10 digits.")
      .max(20, "Phone number cannot exceed more than 20 digits.")
      .regex(/^\d+$/, "Phone number must contain only digits")
      .nonempty("Phone number is required."),
    district: z
      .string()
      .regex(/^[A-Za-z]+$/, "District name must contain alphabets only.")
      .nonempty("District name is required."),
    sex: sexEnum,
    city: z
      .string()
      .regex(/^[A-Za-z]+$/, "City name must contain alphabets only.")
      .nonempty("City name is required."),
  });

  const validateFields = onboardingData.safeParse({
    imageUrl: formData.get("imageUrl") as string,
    bio: formData.get("bio") as string,
    favoriteDestination: favoriteDestinations,
    sex: formData.get("sex") as string,
    district: formData.get("district") as string,
    phoneNumber: formData.get("phoneNumber") as string,
    city: formData.get("city") as string,
  });

  if (!validateFields.success) {
    return {
      errors: validateFields.error.flatten().fieldErrors,
      message: "Error validating!",
      success: false,
      inputs: Object.fromEntries(formData.entries()),
    };
  }

  const { bio, imageUrl, district, sex, phoneNumber, city } =
    validateFields.data;

  try {
    const [userRecord] = await db
      .select()
      .from(user)
      .where(eq(user.id, userId));
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

    await db.insert(studentProfile).values({
      userId,
      imageUrl,
      favoriteDestination: lowerCaseFavoriteDestinations,
      bio,
      sex: sex,
      phoneNumber,
      district: district.toLowerCase(),
      city: city.toLowerCase(),
      createdAt: new Date(),
      updatedAt: new Date(),
    } satisfies StudentProfileInsertType);

    return {
      message: "Onboarding form submitted successfully!",
      success: true,
      redirectTo: "/dashboard/student",
    };
  } catch (error) {
    console.error("Database error: ", error);
    return {
      errors: {
        bio: ["Something went wrong!"],
      },
      message: "Something went wrong!",
      success: false,
    };
  }
}
