"use server";

import { redirect } from "next/navigation";
import { db } from "../../../../lib/db";
import { studentProfile } from "../../../../lib/db/schema";
import { eq } from "drizzle-orm";

export async function getStudentProfile(userId: string) {
  const [studentRecord] = await db
    .select()
    .from(studentProfile)
    .where(eq(studentProfile.userId, userId));
  if (!studentRecord) {
    return redirect("/onboarding/student?toast=Please+complete+your+student+profile+first");
  }
  return redirect("/dashboard/student?toast=Welcome+to+your+dashboard!");
}
