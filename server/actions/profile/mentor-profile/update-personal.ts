"use server";

import z from "zod";
import { getCurrentMentor } from "../../../lib/auth/helpers/getCurrentMentor";
import { db } from "../../../../lib/db";
import { mentorProfile, user } from "../../../../lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export type FormState = {
  errors?: {
    imageUrl?: string[];
    fullName?: string[];
    nationality?: string[];
    bio?: string[];
  };
  message: string;
  userId?: string;
  timestamp: number;
  success: boolean;
  inputs?: {
    imageUrl?: string;
    fullName?: string;
    nationality?: string;
    bio?: string;
  };
};

export async function updatePersonal(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
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

  console.log("formdata: ", formData);

  const personalSchema = z.object({
    imageUrl: z.string().optional(),

    fullName: z
      .string()
      .trim()
      .regex(/^[a-zA-Z\s]*$/, {
        message: "Name can only contain letters and spaces",
      })
      .min(2, "Full name must be at least 2 characters"),

    nationality: z
      .string()
      .trim()
      .regex(/^[a-zA-Z\s]*$/, {
        message: "Nationality can only contain letters and spaces",
      })
      .min(2, "Nationality must be at least 2 characters"),

    bio: z
      .string()
      .trim()
      .regex(/^[a-zA-Z.'\s]*$/, {
        message: "Bio can only contain letters, spaces, . and '",
      })
      .min(20, "Bio must be at least 20 characters"),
  });

  const validateFields = personalSchema.safeParse({
    imageUrl: formData.get("imageUrl") as string,
    fullName: formData.get("fullName") as string,
    nationality: formData.get("nationality") as string,
    bio: formData.get("bio") as string,
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

  const { imageUrl, fullName, nationality, bio } = validateFields.data;

  try {
    await db
      .update(mentorProfile)
      .set({
        imageUrl,
        nationality: nationality.toLowerCase(),
        bio: bio.toLowerCase(),
        updatedAt: new Date(),
      })
      .where(eq(mentorProfile.userId, userId));

    if (fullName || imageUrl) {
      await db
        .update(user)
        .set({
          image: imageUrl,
          name: fullName,
          updatedAt: new Date(),
        })
        .where(eq(user.id, userId));
    }

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
