"use server";

import z from "zod";

import { db } from "../../../lib/db";
import { school, SchoolInsertType, user } from "../../../lib/db/schema";
import { getCurrentAdmin } from "../../lib/auth/helpers/getCurrentAdmin";

export type FormState = {
  errors?: {
    name?: string[];
    address?: string[];
    city?: string[];
    prefecture?: string[];
    websiteUrl?: string[];
    email?: string[];
    imageUrl?: string[];
  };
  message?: string;
  success?: boolean;
  inputs?: {
    name?: string;
    address?: string;
    city?: string;
    prefecture?: string;
    websiteUrl?: string;
    email?: string;
    imageUrl?: string;
  };
};

export async function addSchool(prevState: FormState, formData: FormData) {
  const schoolData = z.object({
    name: z.string().min(1, "Name is required").nonempty(),

    address: z.string().min(1, "Address is required").nonempty(),
    city: z
      .string()
      .min(1, "city is required")
      .nonempty()
      .regex(/^[A-Za-z]+$/, "Only alphabets A-Z or a-z are allowed"),
    prefecture: z
      .string()
      .min(1, "prefecture is required")
      .nonempty()
      .regex(/^[A-Za-z]+$/, "Only alphabets A-Z or a-z are allowed"),

    websiteUrl: z.string().min(1, "Website url is required").nonempty(),
    email: z.string().email().nonempty(),
    imageUrl: z.string().min(1, "Image url is required").nonempty(),
  });

  const validateFields = schoolData.safeParse({
    name: formData.get("name") as string,
    address: formData.get("address") as string,
    city: formData.get("city") as string,
    prefecture: formData.get("prefecture") as string,
    email: formData.get("email") as string,
    websiteUrl: formData.get("websiteUrl") as string,
    imageUrl: formData.get("imageUrl") as string,
  });
  if (!validateFields.success) {
    return {
      errors: validateFields.error.flatten().fieldErrors,
      message: "Error validating!",
      success: false,
      inputs: Object.fromEntries(formData.entries()),
    };
  }

  const { name, city, prefecture, address, email, imageUrl, websiteUrl } =
    validateFields.data;

  try {
    const result = await getCurrentAdmin();
    if (!result.success) return result;

    await db.insert(school).values({
      name,
      city,
      prefecture,
      email,
      imageUrl,
      websiteUrl,
      address,
    } satisfies SchoolInsertType);

    return { success: true, message: "School data added successfully!" };
  } catch (error) {
    console.error("Error: ", error);
    return {
      success: false,
      message: "Something went wrong!",
    };
  }
}
