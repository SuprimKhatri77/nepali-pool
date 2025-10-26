import { headers } from "next/headers";
import { auth } from "../../../server/lib/auth/auth";
import { notFound, redirect } from "next/navigation";
import { db } from "../../../lib/db";
import { mentorProfile, studentProfile, user } from "../../../lib/db/schema";
import { eq } from "drizzle-orm";

export default async function Onboarding() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return redirect("/login?toast=Please+log+in+to+continue");
  }

  const [userRecord] = await db
    .select()
    .from(user)
    .where(eq(user.id, session.user.id));
  if (!userRecord) {
    return redirect("/sign-up?toast=Please+create+an+account+to+continue");
  }

  if (!userRecord.emailVerified) {
    return redirect(
      `/sign-up/verify-email?email=${encodeURIComponent(userRecord.email)}`
    );
  }
  if (userRecord.role === "none") {
    return redirect("/select-role");
  }

  const [mentorProfileRecord] = await db
    .select()
    .from(mentorProfile)
    .where(eq(mentorProfile.userId, userRecord.id));
  if (userRecord.role === "mentor") {
    if (!mentorProfileRecord) {
      return redirect("/sign-up/onboarding/mentor");
    }
    if (mentorProfileRecord.verifiedStatus === "pending") {
      return redirect("/waitlist?toast=Your+mentor+profile+is+under+review");
    }
    if (mentorProfileRecord.verifiedStatus === "rejected") {
      return redirect("/rejected?toast=Your+mentor+profile+was+rejected");
    }
    return redirect("/dashboard/mentor?toast=Welcome+to+your+dashboard!");
  }

  const [studentProfileRecord] = await db
    .select()
    .from(studentProfile)
    .where(eq(studentProfile.userId, userRecord.id));
  if (userRecord.role === "student") {
    if (!studentProfileRecord) {
      return redirect("/sign-up/onboarding/student");
    }
    return redirect("/dashboard/student?toast=Welcome+to+your+dashboard!");
  }

  return notFound();
}
