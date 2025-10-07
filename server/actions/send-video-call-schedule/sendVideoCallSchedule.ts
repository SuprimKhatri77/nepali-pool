"use server";

import z from "zod";
import { db } from "../../../lib/db";
import {
  preferredTime,
  preferredTimeLog,
  user,
  videoCall,
} from "../../../lib/db/schema";
import { eq } from "drizzle-orm";
import { sendEmail } from "../../lib/send-email";
import { auth } from "../../lib/auth/auth";
import { headers } from "next/headers";

const roleEnum = z
  .string()
  .refine((val) => ["student", "mentor"].includes(val), {
    message: "Invalid role!",
  }) as z.ZodType<"student" | "mentor">;

export async function sendVideoCallSchedule(
  videoId: string,
  date: string,
  role: string,
  time: string,
  studentId: string,
  mentorId: string
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return {
      redirectTo: "/login",
      message: "Not authenticated",
      success: false,
    };
  }

  const [userRecord] = await db
    .select()
    .from(user)
    .where(eq(user.id, session.user.id));
  if (!userRecord) {
    return {
      redirectTo: "/sign-up",
      message: "No user record found!",
      success: false,
    };
  }
  const data = z.object({
    videoId: z.string({ required_error: "Video ID is required" }).nonempty(),
    date: z
      .string({ required_error: "Date is required" })
      .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" }),
    time: z
      .string({ required_error: "Time is required" })
      .refine((val) => /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/.test(val), {
        message: "Invalid time format (HH:mm)",
      }),
    role: roleEnum,
    studentId: z
      .string({ required_error: "Student ID is requireed" })
      .nonempty(),
    mentorId: z.string({ required_error: "Mentor ID is required" }).nonempty(),
  });

  const validateFields = data.safeParse({
    videoId,
    date,
    role,
    time,
    studentId,
    mentorId,
  });

  if (!validateFields.success) {
    return {
      errors: validateFields.error.flatten().fieldErrors,
      message: "Validation Failed",
      success: true,
      timesamp: new Date(),
    };
  }
  // console.log("Data: ", validateFields.data);
  const validated = validateFields.data;
  const [hours, minutes, seconds] = validated.time.split(":").map(Number);
  const combinedDate = new Date(validated.date);
  combinedDate.setHours(hours, minutes, seconds || 0);

  try {
    const [studentRecord] = await db
      .select()
      .from(user)
      .where(eq(user.id, validated.studentId));
    if (!studentRecord) {
      return {
        message: "No record found for the student!",
        success: false,
      };
    }

    const [mentorRecord] = await db
      .select()
      .from(user)
      .where(eq(user.id, validated.mentorId));
    if (!mentorRecord) {
      return {
        message: "No record found for the mentor!",
        success: false,
      };
    }

    await db.insert(preferredTimeLog).values({
      videoId: validated.videoId,
      suggestedBy: validated.role,
      suggestedTime: combinedDate,
    });

    const [preferredTimeRecord] = await db
      .select()
      .from(preferredTime)
      .where(eq(preferredTime.videoId, validated.videoId));
    if (!preferredTimeRecord) {
      return;
    }
    await db
      .update(preferredTime)
      .set({
        mentorPreferredTime: combinedDate,
        studentPreferredTime: combinedDate,
        status: "accepted",
        updatedAt: new Date(),
      })
      .where(eq(preferredTime.videoId, validated.videoId));

    await db
      .update(videoCall)
      .set({
        scheduledTime: combinedDate,
        startUrl: "test-start-url",
        joinUrl: "test-join-url",
        status: "scheduled",
        zoomMeetingId: "test-zoom-meeting-id",
      })
      .where(eq(videoCall.id, validated.videoId));

    await sendEmail({
      to: mentorRecord.email,
      subject: "Video Call Schedule",
      html: `Your video call with the student ${studentRecord.name} has been scheduled at time : 123. Please be ready for the call with the student.<br>ZOOM MEETING START URL: test-start-url`,
    });

    await sendEmail({
      to: studentRecord.email,
      subject: "Video Call Schedule",
      html: `Your video call with the mentor ${mentorRecord.name} has been scheduled at time : 123. Please be ready for the call with the mentor.<br>ZOOM MEETING JOIN URL: test-join-url`,
    });

    return {
      success: true,
      message: "Video call scheduled successfully, Please check your mail!",
      redirectTo: `/dashboard/${validated.role}`,
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      errors: "Something went wrong!",
      message: "Something went wrong!",
      success: true,
    };
  }
}
