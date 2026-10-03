"use server";

// ACCEPTING THE OTHER SIDE'S PROPOSED TIME AND SCHEDULING THE CALL

import z from "zod";
import { db } from "../../../lib/db";
import { preferredTime, user, videoCall } from "../../../lib/db/schema";
import { and, eq, ne, TransactionRollbackError } from "drizzle-orm";
import { sendEmail } from "../../lib/send-email";
import { getViewer } from "../../lib/auth/viewer";
import { revalidatePath } from "next/cache";
import { isUniqueViolation } from "../../lib/mentor-services/pg-error";

type sendVideoCallScheduleType =
  | { success: true; message: string; timestamp: number }
  | {
      success: false;
      message: string;
      errors: {
        videoId?: string[] | undefined;
      };
      timestamp: number;
    };

function failure(message: string): sendVideoCallScheduleType {
  return { success: false, message, errors: {}, timestamp: Date.now() };
}

// The caller accepts the time the *other* side proposed last. Who the caller
// is, which side they are on and the time itself all come from the session
// and the database, never from the client.
export async function sendVideoCallSchedule(
  videoId: string,
): Promise<sendVideoCallScheduleType> {
  const viewer = await getViewer();
  if (viewer.status !== "student" && viewer.status !== "mentor") {
    return failure("Unauthorized");
  }
  const role = viewer.status;
  const userId = viewer.user.id;

  if (!z.uuid().safeParse(videoId).success) {
    return {
      success: false,
      message: "Validation Failed",
      errors: { videoId: ["Invalid video call"] },
      timestamp: Date.now(),
    };
  }

  try {
    const videoRecord = await db.query.videoCall.findFirst({
      where: and(
        eq(videoCall.id, videoId),
        role === "student"
          ? eq(videoCall.studentId, userId)
          : eq(videoCall.mentorId, userId),
      ),
      with: { preferredTime: true },
    });
    if (!videoRecord) return failure("No video record found");
    if (videoRecord.status !== "pending") {
      return failure(`The video call is already ${videoRecord.status}`);
    }

    const proposal = videoRecord.preferredTime;
    const proposedTime =
      role === "student"
        ? proposal?.mentorPreferredTime
        : proposal?.studentPreferredTime;
    if (!proposal || proposal.lastSentBy === role || !proposedTime) {
      return failure("There is no proposed time from the other side to accept");
    }

    const scheduled = await db.transaction(async (tx) => {
      const [acceptedTime] = await tx
        .update(preferredTime)
        .set({
          mentorPreferredTime: proposedTime,
          studentPreferredTime: proposedTime,
          status: "accepted",
          lastSentBy: role,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(preferredTime.videoId, videoId),
            ne(preferredTime.status, "accepted"),
          ),
        )
        .returning({ id: preferredTime.id });
      if (!acceptedTime) return false;

      const [updatedCall] = await tx
        .update(videoCall)
        .set({
          scheduledTime: proposedTime,
          startUrl: "test-start-url",
          joinUrl: "test-join-url",
          status: "scheduled",
          zoomMeetingId: "test-zoom-meeting-id",
          updatedAt: new Date(),
        })
        .where(and(eq(videoCall.id, videoId), eq(videoCall.status, "pending")))
        .returning({ id: videoCall.id });
      if (!updatedCall) {
        // Someone else changed the call meanwhile; undo the acceptance.
        tx.rollback();
      }
      return true;
    });
    if (!scheduled)
      return failure("This video call has already been scheduled");

    // Emails only go out once, after this request actually scheduled the call.
    const [studentRecord, mentorRecord] = await Promise.all([
      db.query.user.findFirst({ where: eq(user.id, videoRecord.studentId) }),
      db.query.user.findFirst({ where: eq(user.id, videoRecord.mentorId) }),
    ]);
    if (studentRecord && mentorRecord) {
      try {
        await sendEmail({
          to: mentorRecord.email,
          subject: "Video Call Schedule",
          html: `Your video call with the student ${studentRecord.name} has been scheduled at time : ${proposedTime}. Please be ready for the call with the student.<br>ZOOM MEETING START URL: test-start-url`,
        });
        await sendEmail({
          to: studentRecord.email,
          subject: "Video Call Schedule",
          html: `Your video call with the mentor ${mentorRecord.name} has been scheduled at time : ${proposedTime}. Please be ready for the call with the mentor.<br>ZOOM MEETING JOIN URL: test-join-url`,
        });
      } catch (error) {
        // The call is scheduled either way; the emails are a courtesy.
        console.error("Schedule emails failed: ", error);
      }
    }

    revalidatePath(
      role === "student"
        ? `/video-call/schedule/${videoId}`
        : `/video-call/respond/${videoId}`,
    );
    return {
      success: true,
      message: "Video call scheduled successfully, Please check your mail!",
      timestamp: Date.now(),
    };
  } catch (error) {
    // tx.rollback() throws to abort the transaction.
    if (error instanceof TransactionRollbackError) {
      return failure("This video call has already been scheduled");
    }
    if (isUniqueViolation(error, "unique_student_mentor_status")) {
      return failure(
        "There is already a scheduled call between this student and mentor."
      );
    }
    console.error("Error:", error);
    return failure("Something went wrong!");
  }
}
