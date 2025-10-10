"use server";

import { eq } from "drizzle-orm";
import { db } from "../../../../lib/db";
import { mentorProfile } from "../../../../lib/db/schema";
import { MentorProfileWithUser } from "../../../../types/all-types";
import { getCurrentUser } from "./getCurrentUser";

type CurrentMentor =
  | { success: true; mentorRecord: MentorProfileWithUser }
  | { success: false; message: string };

export async function getCurrentMentor(): Promise<CurrentMentor> {
  const result = await getCurrentUser();
  if (!result.success) {
    console.error(result.message);
    return result;
  }

  const userRecord = result.userRecord;
  if (userRecord.role !== "mentor") {
    return { message: "Access denied, Not a Mentor", success: false };
  }

  const mentorRecord = await db.query.mentorProfile.findFirst({
    where: (fields, { eq }) => eq(mentorProfile.userId, userRecord.id),
    with: {
      user: true,
    },
  });
  if (!mentorRecord) {
    return { message: "Missing mentor profile record", success: false };
  }
  if (mentorRecord.verifiedStatus === "rejected") {
    return {
      message: "Access denied, Mentor status is rejected",
      success: false,
    };
  }
  if (mentorRecord.verifiedStatus === "pending") {
    return {
      message: "Access denied, Mentor status is pending",
      success: false,
    };
  }

  return { success: true, mentorRecord };
}
