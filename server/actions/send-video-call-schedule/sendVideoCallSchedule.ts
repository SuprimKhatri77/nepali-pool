"use server";

// SENDING THE VIDEO CALL TIME TO MENTOR AND STUDENT

import z from "zod";
import { db } from "../../../lib/db";
import {
  preferredTime,
  preferredTimeLog,
  user,
  videoCall,
} from "../../../lib/db/schema";
import { and, eq } from "drizzle-orm";
import { sendEmail } from "../../lib/send-email";
import { getCurrentUser } from "../../lib/auth/helpers/getCurrentUser";
import { revalidatePath } from "next/cache";

const roleEnum = z
  .string()
  .refine((val) => ["student", "mentor"].includes(val), {
    message: "Invalid role!",
  }) as z.ZodType<"student" | "mentor">;

type sendVideoCallScheduleType =
  | { success: true; message: string; timestamp: number }
  | {
      success: false;
      message: string;
      errors: {
        date?: string[] | undefined;
        videoId?: string[] | undefined;
        // time?: string[] | undefined;
        role?: string[] | undefined;
        studentId?: string[] | undefined;
        mentorId?: string[] | undefined;
      };
      timestamp: number;
    };
export async function sendVideoCallSchedule(
  videoId: string,
  date: string,
  role: string,
  // time: string,
  studentId: string,
  mentorId: string
): Promise<sendVideoCallScheduleType> {
  const result = await getCurrentUser();
  if (!result.success)
    return {
      success: result.success,
      message: result.message,
      timestamp: Date.now(),
      errors: {},
    };

  const data = z.object({
    videoId: z.string({ required_error: "Video ID is required" }).nonempty(),
    date: z
      .string({ required_error: "Date is required" })
      .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" }),
    // time: z
    //   .string({ required_error: "Time is required" })
    //   .refine((val) => /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/.test(val), {
    //     message: "Invalid time format (HH:mm)",
    //   }),
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
    // time,
    studentId,
    mentorId,
  });

  console.log("date: ", date);
  console.log("date type: ", typeof date);
  console.log("videoId: ", videoId);
  console.log("role: ", role);
  console.log("studentId: ", studentId);
  console.log("mentorId: ", mentorId);
  if (!validateFields.success) {
    console.log(
      "validation error: ",
      validateFields.error.flatten().fieldErrors
    );
    return {
      errors: validateFields.error.flatten().fieldErrors,
      message: "Validation Failed",
      success: false,
      timestamp: Date.now(),
    };
  }
  // console.log("Data: ", validateFields.data);
  const validated = validateFields.data;
  // const [hours, minutes, seconds] = validated.time.split(":").map(Number);
  const combinedDate = new Date(validated.date);
  // combinedDate.setHours(hours, minutes, seconds || 0);
  console.log("combined date: ", combinedDate);
  console.log("converted date: ", combinedDate.toLocaleString());

  try {
    const [videoRecord] = await db
      .select()
      .from(videoCall)
      .where(
        and(
          eq(videoCall.id, validated.videoId),
          eq(videoCall.studentId, validated.studentId),
          eq(videoCall.mentorId, validated.mentorId)
        )
      );

    if (!videoRecord) {
      return {
        success: false,
        message: "No video record found",
        errors: {},
        timestamp: Date.now(),
      };
    }
    if (videoRecord.status !== "pending") {
      return {
        success: false,
        message: `The video call is already ${videoRecord.status}`,
        errors: {},
        timestamp: Date.now(),
      };
    }
    const [studentRecord] = await db
      .select()
      .from(user)
      .where(eq(user.id, validated.studentId));
    if (!studentRecord) {
      return {
        message: "No record found for the student!",
        success: false,
        errors: {},
        timestamp: Date.now(),
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
        errors: {},
        timestamp: Date.now(),
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
      return {
        success: false,
        message: "No time record found for the video",
        errors: {},
        timestamp: Date.now(),
      };
    }
    await db
      .update(preferredTime)
      .set({
        mentorPreferredTime: combinedDate,
        studentPreferredTime: combinedDate,
        status: "accepted",
        lastSentBy: role as "student" | "mentor",
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
        updatedAt: new Date(),
      })
      .where(eq(videoCall.id, validated.videoId));

    await sendEmail({
      to: mentorRecord.email,
      subject: "Video Call Schedule",
      html: `Your video call with the student ${studentRecord.name} has been scheduled at time : ${combinedDate}. Please be ready for the call with the student.<br>ZOOM MEETING START URL: test-start-url`,
    });

    await sendEmail({
      to: studentRecord.email,
      subject: "Video Call Schedule",
      html: `Your video call with the mentor ${mentorRecord.name} has been scheduled at time : ${combinedDate}. Please be ready for the call with the mentor.<br>ZOOM MEETING JOIN URL: test-join-url`,
    });
    if (role === "student") {
      revalidatePath(`/video-call/schedule/${videoId}`);
    } else {
      revalidatePath(`/video-call/respond/${videoId}`);
    }
    return {
      success: true,
      message: "Video call scheduled successfully, Please check your mail!",
      // redirectTo: `/dashboard/${validated.role}`,
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      message: "Something went wrong!",
      success: false,
      timestamp: Date.now(),
      errors: {},
    };
  }
}
