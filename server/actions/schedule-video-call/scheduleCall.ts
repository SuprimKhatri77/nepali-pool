"use server";

// STUDENT MENTOR MUTUAL SCHEDULATION

import { z } from "zod";
import { db } from "../../../lib/db";
import {
  preferredTime,
  preferredTimeLog,
  videoCall,
} from "../../../lib/db/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "../../lib/auth/helpers/getCurrentUser";

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
  const combinedDate = new Date(`${date}T${time}`);
  console.log("combineddate: ", combinedDate);

  try {
    const result = await getCurrentUser();
    if (!result.success) {
      return {
        success: result.success,
        message: result.message,
        timestamp: new Date(),
      };
    }
    const [videoCallRecord] = await db
      .select()
      .from(videoCall)
      .where(eq(videoCall.id, videoId));

    if (!videoCallRecord) {
      return {
        success: false,
        message: "No video call record found",
        timestamp: new Date(),
      };
    }

    if (videoCallRecord.status !== "pending") {
      return {
        success: false,
        message: `The video call is already ${videoCallRecord.status}`,
        timestamp: new Date(),
      };
    }
    await db.insert(preferredTimeLog).values({
      videoId,
      suggestedBy: role,
      suggestedTime: combinedDate,
    });
    const [preferredTimeRecord] = await db
      .select()
      .from(preferredTime)
      .where(and(eq(preferredTime.videoId, videoId)));

    if (role === "student" && !preferredTimeRecord) {
      await db.insert(preferredTime).values({
        videoId,
        status: "pending",
        studentPreferredTime: combinedDate,
        lastSentBy: "student",
      });
      revalidatePath("/dashboard/student");
      revalidatePath(`/video-call/schedule/${videoId}`);
      return {
        success: true,
        message: "Preferred time sent for evaluation to mentor",
        timestamp: new Date(),
      };
    }
    if (role === "student" && preferredTime) {
      await db
        .update(preferredTime)
        .set({
          studentPreferredTime: combinedDate,
          lastSentBy: "student",
          updatedAt: new Date(),
        })
        .where(eq(preferredTime.videoId, videoId));
      revalidatePath("/dashboard/student");
      revalidatePath(`/video-call/schedule/${videoId}`);
      return {
        success: true,
        message: "New Preferred time sent to mentor",
        timestamp: new Date(),
      };
    }

    if (role === "mentor" && preferredTimeRecord) {
      // console.log("COMBINED DATE", combinedDate);
      // console.log("STD PREF TIME: ", preferredTimeRecord.studentPreferredTime);
      if (!preferredTimeRecord) {
        return {
          success: false,
          message: "No scheduling request exists yet",
          timestamp: new Date(),
        };
      }

      if (!preferredTimeRecord.studentPreferredTime) {
        return {
          success: false,
          message: "Student is yet to select a date and time",
          timestamp: new Date(),
        };
      }
      if (
        new Date(combinedDate).getTime() ===
        new Date(preferredTimeRecord?.studentPreferredTime).getTime()
      ) {
        return {
          success: false,
          message: "Select a  different date or click on accept",
          timestamp: new Date(),
        };
      }
      // console.log("I am being triggered(Schedulecall.ts)");
      await db
        .update(preferredTime)
        .set({
          mentorPreferredTime: combinedDate,
          lastSentBy: "mentor",
          updatedAt: new Date(),
        })
        .where(eq(preferredTime.videoId, videoId));
      // console.log("revalidating the path");
      revalidatePath(`/video-call/respond/${videoId}`);
      // console.log("revalidated path");
      revalidatePath("/dashboard/mentor");
      return {
        success: true,
        message: "New Preferred time sent to student, successfully!",
        timestamp: new Date(),
      };
    }

    return {
      success: false,
      message: "Invalid role",
      timestamp: new Date(),
    };
  } catch (error) {
    console.log("Error: ", error);
    return {
      errors: { date: ["Something went wrong!"] },
      success: false,
      message: "Something went wrong!",
      timestamp: new Date(),
    };
  }
}
