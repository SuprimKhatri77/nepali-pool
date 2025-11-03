"use server";

import { db } from "../../../lib/db";
import { MeetingSessionSelectType } from "../../../lib/db/schema";
import { getCurrentUser } from "../auth/helpers/getCurrentUser";

type UserMeetingDataType =
  | { success: false; message: string }
  | { success: true; meetingRecord: MeetingSessionSelectType | null };
export async function getCurrentUserMeetingData(): Promise<UserMeetingDataType> {
  const result = await getCurrentUser();
  if (!result.success) {
    return {
      success: false,
      message: result.message,
    };
  }

  const meetingRecord = await db.query.meetingSession.findFirst({
    where: (fields, { eq }) => eq(fields.studentId, result.userRecord.id),
  });

  return { success: true, meetingRecord: meetingRecord ?? null };
}
