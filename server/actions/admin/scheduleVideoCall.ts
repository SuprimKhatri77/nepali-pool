"use server";

// ADMIN SCHEDULATION

import { and, eq } from "drizzle-orm";
import { db } from "../../../lib/db";
import { user, videoCall } from "../../../lib/db/schema";
import { sendEmail } from "../../lib/send-email";
import { getCurrentAdmin } from "../../lib/auth/guards";
import z from "zod";

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
  formData: FormData,
) {
  const admin = await getCurrentAdmin();
  if (!admin.success) return { success: false, message: admin.message };

  const videoCallId = formData.get("videoCallId");
  if (
    typeof videoCallId !== "string" ||
    !z.uuid().safeParse(videoCallId).success
  ) {
    return { success: false, message: "Invalid video call" };
  }
  try {
    // Student, mentor and status come from the record, not from the form.
    const videoCallRecord = await db.query.videoCall.findFirst({
      where: eq(videoCall.id, videoCallId),
    });
    if (!videoCallRecord) {
      return { success: false, message: "No record found for the video call!" };
    }
    const { studentId, mentorId, status } = videoCallRecord;
    if (status !== "pending") {
      return {
        message: "Your video call either has been scheduled or cancelled!",
        success: false,
      };
    }
    //   zoom ko api call garne yeta
    // storing the reponse
    // extracting the start and join url along with zoomMeetingId yesma

    const [[studentRecord], [mentorRecord]] = await Promise.all([
      db.select().from(user).where(eq(user.id, studentId)),
      db.select().from(user).where(eq(user.id, mentorId)),
    ]);
    if (!studentRecord) {
      return {
        message: "No record found for the student!",
        success: false,
      };
    }
    if (!mentorRecord) {
      return {
        message: "No record found for the mentor",
        success: false,
      };
    }

    // Only the request that actually moves the call out of "pending" sends
    // the emails, so a double submit can't email twice.
    const [scheduled] = await db
      .update(videoCall)
      .set({
        startUrl: "testStart.url",
        joinUrl: "testJoin.url",
        scheduledTime: new Date(),
        zoomMeetingId: "123",
        status: "scheduled",
        updatedAt: new Date(),
      })
      .where(
        and(eq(videoCall.id, videoCallId), eq(videoCall.status, "pending")),
      )
      .returning({ id: videoCall.id });
    if (!scheduled) {
      return {
        message: "Your video call either has been scheduled or cancelled!",
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
    } catch (error) {
      console.error("Schedule emails failed: ", error);
      return {
        message: "The call is scheduled, but sending the emails failed.",
        success: false,
      };
    }
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
