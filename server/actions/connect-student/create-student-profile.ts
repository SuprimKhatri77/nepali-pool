"use server";

import {
  ConnectStudentProfileInsertType,
  connectStudentProfiles,
  countryAppliedToEnum,
  intakeYearEnum,
  studyLevelEnum,
} from "./../../../lib/db/schema";

import z from "zod";
import { intakeMonthEnum } from "../../../lib/db/schema";
import { auth } from "../../lib/auth/auth";
import { headers } from "next/headers";
import { db } from "../../../lib/db";

const createStudentProfileSchema = z.object({
  countryAppliedTo: z.enum(countryAppliedToEnum.enumValues),
  cityAppliedTo: z.string(),
  intakeYear: z.enum(intakeYearEnum.enumValues),
  intakeMonth: z.enum(intakeMonthEnum.enumValues),
  studyLevel: z.enum(studyLevelEnum.enumValues),
  appliedOn: z.date(),
  universityName: z.string(),
  currentStatus: z.string(),
});

const createStudentProfileResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  errors: z
    .object({
      countryAppliedTo: z.array(z.string()).optional(),
      cityAppliedTo: z.array(z.string()).optional(),
      intakeYear: z.array(z.string()).optional(),
      intakeMonth: z.array(z.string()).optional(),
      studyLevel: z.array(z.string()).optional(),
      appliedOn: z.array(z.string()).optional(),
      universityName: z.array(z.string()).optional(),
      currentStatus: z.array(z.string()).optional(),
    })
    .optional(),

  inputs: z
    .object({
      countryAppliedTo: z.string().optional(),
      cityAppliedTo: z.string().optional(),
      intakeYear: z.string().optional(),
      intakeMonth: z.string().optional(),
      studyLevel: z.string().optional(),
      appliedOn: z.date().optional(),
      universityName: z.string().optional(),
      currentStatus: z.string().optional(),
    })
    .optional(),
});

export type CreateStudentProfile = z.infer<typeof createStudentProfileSchema>;
export type CreateStudentProfileResponse = z.infer<
  typeof createStudentProfileResponseSchema
>;
export async function createStudentProfile(
  input: CreateStudentProfile
): Promise<CreateStudentProfileResponse> {
  console.log("input: ", input);
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) return { success: false, message: "Unauthorized" };
  const userRecord = await db.query.user.findFirst({
    where: (fields, { eq }) => eq(fields.id, session.user.id),
  });
  if (!userRecord) return { success: false, message: "User not found." };
  if (userRecord.role !== "student")
    return {
      success: false,
      message: "Only students can perform this action.",
    };
  const validateInput = createStudentProfileSchema.safeParse(input);
  if (!validateInput.success) {
    return {
      success: false,
      message: "Validation failed.",
      errors: validateInput.error.flatten().fieldErrors,
      inputs: validateInput.data,
    };
  }

  try {
    await db.insert(connectStudentProfiles).values({
      ...validateInput.data,
      userId: session.user.id,
    } satisfies ConnectStudentProfileInsertType);
    return { success: true, message: "Profile created successfully." };
  } catch (error) {
    console.log("error: ", error);
    return {
      success: false,
      message: "Failed to create profile.",
      inputs: validateInput.data,
    };
  }
}
