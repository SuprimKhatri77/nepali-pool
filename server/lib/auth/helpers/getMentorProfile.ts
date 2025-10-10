"use server";

import { eq } from "drizzle-orm";
import { db } from "../../../../lib/db";
import { mentorProfile } from "../../../../lib/db/schema";
import { redirect } from "next/navigation";

export async function getMentorProfile(userId: string) {
  const [mentorRecord] = await db
    .select()
    .from(mentorProfile)
    .where(eq(mentorProfile.userId, userId));

  switch (mentorRecord.verifiedStatus) {
    case "pending":
      return redirect("/waitlist");
    case "rejected":
      return redirect("/rejected");
    default:
      return redirect("/dashboard/mentor");
  }
}
