"use server";

import z from "zod";
import { db } from "../../lib/db";
import {
  studentProfile,
  type StudentProfileInsertType,
} from "../../lib/db/schema";

export type FormState = {
  errors?: {
    imageUrl?: string[];
    bio?: string[];
    favoriteDestination?: string[];
  };
  message?: string;
  success?: boolean;
  redirectTo?: string;
};

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

  console.log("Favorite destinations from getAll():", favoriteDestinations);

  const onboardingData = z.object({
    imageUrl: z.string().nonempty("Image cannot be empty"),
    bio: z.string().min(1).nonempty("Bio is required"),
    favoriteDestination: z
      .array(z.string())
      .min(1, "Select at least one destination")
      .max(5, "You can select up to 5 destinations"),
  });

  const validateFields = onboardingData.safeParse({
    imageUrl: formData.get("imageUrl") as string,
    bio: formData.get("bio") as string,
    favoriteDestination: favoriteDestinations,
  });

  if (!validateFields.success) {
    return {
      errors: validateFields.error.flatten().fieldErrors,
      message: "Error validating!",
      success: false,
    };
  }

  const { bio, imageUrl, favoriteDestination } = validateFields.data;

  try {
    await db.insert(studentProfile).values({
      userId,
      imageUrl,
      favoriteDestination,
      bio,
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
