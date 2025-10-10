"use server";

import { redirect } from "next/navigation";
import { db } from "../../lib/db";
import {
  mentorProfile,
  studentProfile,
  UserSelectType,
} from "../../lib/db/schema";
import { eq } from "drizzle-orm";

export async function redirectByRole(userRecord: UserSelectType) {
  switch (userRecord.role) {
    case "student": {
      const [studentRecord] = await db
        .select()
        .from(studentProfile)
        .where(eq(studentProfile.userId, userRecord.id));

      if (!studentRecord) return redirect("/onboarding/student");
      return redirect("/dashboard/student");
    }

    case "mentor": {
      const [mentorRecord] = await db
        .select()
        .from(mentorProfile)
        .where(eq(mentorProfile.userId, userRecord.id));

      if (!mentorRecord) return redirect("/onboarding/mentor");
      if (mentorRecord.verifiedStatus === "pending")
        return redirect("/waitlist");
      if (mentorRecord.verifiedStatus === "rejected")
        return redirect("/rejected");

      return redirect("/dashboard/mentor");
    }

    case "admin":
      return redirect("/admin");

    default:
      return redirect("/select-role");
  }
}
