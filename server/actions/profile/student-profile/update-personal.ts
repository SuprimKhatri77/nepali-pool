"use server";

import z from "zod";
import { getCurrentStudent } from "../../../lib/auth/helpers/getCurrentStudent";
import { db } from "../../../../lib/db";
import { studentProfile, user } from "../../../../lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export type StudentProfileFormState = {
  errors?: {
    imageUrl?: string[];
    fullName?: string[];
    sex?: string[];
    bio?: string[];
  };
  message: string;
  success: boolean;
  timestamp: number;
  inputs?: {
    imageUrl?: string;
    fullName?: string;
    sex?: string;
    bio?: string;
  };
  userId?: string;
};

const sexEnum = z
  .enum(["male", "female", "other"])
  .refine((val) => ["male", "female", "other"].includes(val), {
    message: "Invalid sex",
  });

export async function updatePersonal(
  prevState: StudentProfileFormState,
  formData: FormData
): Promise<StudentProfileFormState> {
  // console.log(formData);
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

  const schema = z.object({
    fullName: z
      .string()
      .trim()
      .regex(/^[a-zA-Z\s]*$/, {
        message: "Name can only contain letters and spaces",
      })
      .min(2, "Full name must be at least 2 characters")
      .nonempty(),
    imageUrl: z.string().nonempty("Image cannot be empty"),
    bio: z
      .string()
      .trim()
      .min(5, "Bio must be atleast 20 characters")
      .nonempty("Bio is required")
      .nonempty(),
    sex: sexEnum,
  });

  const validateFields = schema.safeParse({
    fullName: formData.get("fullName"),
    imageUrl: formData.get("imageUrl"),
    bio: formData.get("bio"),
    sex: formData.get("sex") as "male" | "female" | "other",
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

  const { imageUrl, bio, sex, fullName } = validateFields.data;

  try {
    if (imageUrl) {
      await db
        .update(user)
        .set({
          name: fullName,
          image: imageUrl,
          updatedAt: new Date(),
        })
        .where(eq(user.id, userId));
    }

    await db
      .update(studentProfile)
      .set({
        imageUrl,
        sex,
        bio,
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
