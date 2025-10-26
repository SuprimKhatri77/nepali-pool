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

      if (!studentRecord) return redirect("/onboarding/student?toast=Please+complete+your+student+profile+first");
      return redirect("/dashboard/student?toast=Welcome+to+your+dashboard!");
    }

    case "mentor": {
      const [mentorRecord] = await db
        .select()
        .from(mentorProfile)
        .where(eq(mentorProfile.userId, userRecord.id));

      if (!mentorRecord) return redirect("/onboarding/mentor?toast=Please+complete+your+mentor+profile+first");
      if (mentorRecord.verifiedStatus === "pending")
        return redirect("/waitlist?toast=Your+mentor+profile+is+under+review");
      if (mentorRecord.verifiedStatus === "rejected")
        return redirect("/rejected?toast=Your+mentor+profile+was+rejected");

      return redirect("/dashboard/mentor?toast=Welcome+to+your+dashboard");
    }

    case "admin":
      return redirect("/admin");

    default:
      return redirect("/select-role");
  }
}
