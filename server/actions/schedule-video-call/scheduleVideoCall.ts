"use server";

import { eq } from "drizzle-orm";
import { db } from "../../../lib/db";
import { user, videoCall } from "../../../lib/db/schema";
import { sendEmail } from "../../lib/send-email";

export type FormState = {
  errors?: {
    studentId?: string[];
    mentorId?: string[];
    statusId?: string[];
  };
  message: string;
  success: boolean;
};

export async function scheduleVideoCall(
  prevState: FormState,
  formData: FormData
) {
  const studentId = formData.get("studentId") as string;
  const mentorId = formData.get("mentorId") as string;
  const status = formData.get("status") as
    | "pending"
    | "cancelled"
    | "scheduled";
  const videoCallId = formData.get("videoCallId") as string;
  if (status !== "pending") {
    return {
      message: "Your video call either has been scheduled or cancelled!",
      success: false,
    };
  }
  if (!studentId || !mentorId) {
    return {
      success: false,
      message: "Missing Student ID or Mentor ID",
    };
  }
  //   zoom ko api call garne yeta
  // storing the reponse
  // extracting the start and join url along with zoomMeetingId yesma

  const [studentRecord] = await db
    .select()
    .from(user)
    .where(eq(user.id, studentId));
  if (!studentRecord) {
    return {
      message: "No record found for the student!",
      success: false,
    };
  }
  const [mentorRecord] = await db
    .select()
    .from(user)
    .where(eq(user.id, mentorId));
  if (!mentorRecord) {
    return {
      message: "No record found for the mentor",
      success: false,
    };
  }

  try {
    await sendEmail({
      to: studentRecord.email,
      subject: "Video Call Schedule",
      html: `Your video call with the mentor ${mentorRecord.name} has been scheduled at time : 123. Please be ready for the call with the mentor.<br>ZOOM MEETING JOIN URL: testJoin.url`,
    });
    await sendEmail({
      to: mentorRecord.email,
      subject: "Video Call Schedule",
      html: `Your video call with the student ${studentRecord.name} has been scheduled at time : 123. Please be ready for the call with the student.<br>ZOOM MEETING JOIN URL: testStart.url`,
    });
    await db
      .update(videoCall)
      .set({
        startUrl: "testStart.url",
        joinUrl: "testJoin.url",
        scheduledTime: new Date(),
        zoomMeetingId: "123",
        status: "scheduled",
        updatedAt: new Date(),
      })
      .where(eq(videoCall.id, videoCallId));
    return {
      message: "Sent the schedule mail to mentor and student successfully!",
      success: true,
    };
  } catch (error) {
    console.error("Error: ", error);
    return {
      message: "Something went wrong!",
      success: false,
    };
  }
}
