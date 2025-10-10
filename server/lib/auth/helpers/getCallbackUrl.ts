"use server";

import { eq } from "drizzle-orm";
import { db } from "../../../../lib/db";
import {
  mentorProfile,
  studentProfile,
  UserSelectType,
} from "../../../../lib/db/schema";

export async function getCallbackUrl(userRecord: UserSelectType) {
  switch (userRecord.role) {
    case "admin":
      return "/admin";
    case "mentor":
      const [mentorRecord] = await db
        .select()
        .from(mentorProfile)
        .where(eq(mentorProfile.userId, userRecord.id));
      if (!mentorRecord) {
        return "/onboarding/mentor";
      }
      switch (mentorRecord.verifiedStatus) {
        case "pending":
          return "/waitlist";
        case "rejected":
          return "/rejected";
        default:
          return "/dashboard/mentor";
      }
    case "student":
      const [studentRecord] = await db
        .select()
        .from(studentProfile)
        .where(eq(studentProfile.userId, userRecord.id));
      if (!studentRecord) {
        return "/onboarding/student";
      }
      return "/dashboard/student";
    default:
      return "/select-role";
  }
}
