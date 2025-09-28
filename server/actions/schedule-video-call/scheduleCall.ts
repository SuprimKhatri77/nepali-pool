"use server";

import { z } from "zod";
import { db } from "../../../lib/db";
import { preferredTime, preferredTimeLog } from "../../../lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export type FormState = {
  errors?: {
    date?: string[];
    time?: string[];
    videoId?: string[];
    role?: string[];
  };
  message: string;
  success: boolean;
  timestamp: Date;
};

const roleEnum = z
  .string()
  .refine((val) => ["student", "mentor"].includes(val), {
    message: "Invalid role. Allowed roles: student or mentor.",
  }) as z.ZodType<"student" | "mentor">;

export async function scheduleVideoCallTime(
  prevState: FormState,
  formData: FormData
) {
  const data = z.object({
    date: z
      .string({ required_error: "Date is required" })
      .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" }),
    time: z
      .string({ required_error: "Time is required" })
      .refine((val) => /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/.test(val), {
        message: "Invalid time format (HH:mm)",
      }),
    videoId: z.string(),
    role: roleEnum,
  });

  const parsedData = data.safeParse({
    date: formData.get("date"),
    time: formData.get("time"),
    videoId: formData.get("videoId"),
    role: formData.get("role"),
  });

  if (!parsedData.success) {
    return {
      errors: parsedData.error.flatten().fieldErrors,
      success: false,
      message: "Validation failed",
      timestamp: new Date(),
    };
  }

  const { date, time, videoId, role } = parsedData.data;
  const [hours, minutes, seconds] = time.split(":").map(Number);
  const combinedDate = new Date(date);
  combinedDate.setHours(hours, minutes, seconds || 0);

  try {
    await db.insert(preferredTimeLog).values({
      videoId,
      suggestedBy: role,
      suggestedTime: combinedDate,
    });
    const [preferredTimeRecord] = await db
      .select()
      .from(preferredTime)
      .where(eq(preferredTime.videoId, videoId));
    if (role === "student" && !preferredTimeRecord) {
      await db.insert(preferredTime).values({
        videoId,
        status: "pending",
        studentPreferredTime: combinedDate,
      });
      revalidatePath("/dashboard/student");
      revalidatePath(`/video-call/schedule/${videoId}`);
      return {
        success: true,
        message: "Preferred time sent for evaluation to mentor, successfully!",
        timestamp: new Date(),
      };
    } else if (role === "mentor" && !preferredTimeRecord) {
      await db.insert(preferredTime).values({
        videoId,
        status: "pending",
        mentorPreferredTime: combinedDate,
      });
      revalidatePath("/dashboard/mentor");
      revalidatePath(`/video-call/respond/${videoId}`);
      return {
        success: true,
        message: "Preferred time sent to student, successfully!",
        timestamp: new Date(),
      };
    }

    if (role === "student") {
      await db
        .update(preferredTime)
        .set({
          studentPreferredTime: combinedDate,
          updatedAt: new Date(),
        })
        .where(eq(preferredTime.videoId, videoId));
      revalidatePath("/dashboard/student");
      revalidatePath(`/video-call/schedule/${videoId}`);
      return {
        success: true,
        message:
          "New Preferred time sent for evaluation to mentor, successfully!",
        timestamp: new Date(),
      };
    } else if (role === "mentor") {
      await db
        .update(preferredTime)
        .set({
          mentorPreferredTime: combinedDate,
          updatedAt: new Date(),
        })
        .where(eq(preferredTime.videoId, videoId));
      revalidatePath("/dashboard/mentor");
      revalidatePath(`/video-call/respond/${videoId}`);
      return {
        success: true,
        message: "New Preferred time sent to student, successfully!",
        timestamp: new Date(),
      };
    }
    return {
      success: true,
      message: "Invalid role",
      timestamp: new Date(),
    };
  } catch (error) {
    return {
      errors: { date: ["Something went wrong!"] },
      success: false,
      message: "Something went wrong!",
      timestamp: new Date(),
    };
  }
}
