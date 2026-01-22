"use server";

import z from "zod";
import {
  connectStudentProfiles,
  countryAppliedToEnum,
  intakeMonthEnum,
  intakeYearEnum,
  studyLevelEnum,
} from "../../../lib/db/schema";
import { db } from "../../../lib/db";
import { auth } from "../../lib/auth/auth";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";

const updateStudentProfileSchema = z.object({
  countryAppliedTo: z.enum(countryAppliedToEnum.enumValues),
  cityAppliedTo: z.string(),
  intakeYear: z.enum(intakeYearEnum.enumValues),
  intakeMonth: z.enum(intakeMonthEnum.enumValues),
  studyLevel: z.enum(studyLevelEnum.enumValues),
  appliedOn: z.date(),
  universityName: z.string(),
  currentStatus: z.string(),
  whatsAppNumber: z
    .string()
    .min(7)
    .max(15)
    .regex(/^\+?\d+$/, "Must be a valid phone number"),
  facebookProfileLink: z
    .string()
    .url()
    .nonempty()
    .refine(
      (val) => /^https?:\/\/(www\.)?facebook\.com\/[A-Za-z0-9\.]+$/.test(val),
      {
        message: "Must be a valid Facebook profile URL",
      },
    )
    .optional(),
});

const updateStudentProfileResponseSchema = z.object({
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
      whatsAppNumber: z.array(z.string()).optional(),
      facebookProfileLink: z.array(z.string()).optional(),
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
      whatsAppNumber: z.string().optional(),
      facebookProfileLink: z.string().optional(),
    })
    .optional(),
});
export type UpdateStudentProfile = z.infer<typeof updateStudentProfileSchema>;
export type UpdateStudentProfileResponse = z.infer<
  typeof updateStudentProfileResponseSchema
>;
export async function updateStudentCard(
  data: z.infer<typeof updateStudentProfileSchema>,
): Promise<z.infer<typeof updateStudentProfileResponseSchema>> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || !session.user) {
    return { success: false, message: "Unauthorized." };
  }
  const userRecord = await db.query.user.findFirst({
    where: (fields, { eq }) => eq(fields.id, session.user.id),
  });
  if (!userRecord) {
    await auth.api.signOut({ headers: await headers() });
    return {
      success: false,
      message: "User doesn't have a user record.",
    };
  }

  if (userRecord.role !== "student") {
    return {
      success: false,
      message: "You're not authorized to perform this action.",
    };
  }

  const validateFileds = updateStudentProfileSchema.safeParse(data);
  if (!validateFileds.success) {
    return {
      success: false,
      message: "Validation failed.",
      errors: validateFileds.error.flatten().fieldErrors,
      inputs: data,
    };
  }

  try {
    const hasConnectStudentProfile =
      await db.query.connectStudentProfiles.findFirst({
        where: (fields, { eq }) => eq(fields.userId, userRecord.id),
      });
    if (!hasConnectStudentProfile) {
      return {
        success: false,
        message: "You don't have a student profile.",
      };
    }
    await db
      .update(connectStudentProfiles)
      .set({ ...validateFileds.data })
      .where(eq(connectStudentProfiles.userId, userRecord.id));
    return { success: true, message: "Profile updated successfully." };
  } catch (error) {
    console.error("error: ", error);
    return { success: false, message: "Failed to update the student profile." };
  }
}
