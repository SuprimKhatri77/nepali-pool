import { headers } from "next/headers";
import { auth } from "../../../server/lib/auth/auth";
import { redirect } from "next/navigation";
import { db } from "../../../lib/db";
import { mentorProfile, studentProfile, user } from "../../../lib/db/schema";
import { eq } from "drizzle-orm";

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const [userRecord] = await db
    .select()
    .from(user)
    .where(eq(user.id, session.user.id));
  if (!userRecord) {
    redirect("/sign-up");
  }

  if (!userRecord.emailVerified) {
    redirect(
      `/sign-up/verify-email?email=${encodeURIComponent(userRecord.email)}`
    );
  }

  if (userRecord.role === "none") {
    redirect("/select-role");
  }

  if (userRecord.role === "student") {
    const [studentProfileRecord] = await db
      .select()
      .from(studentProfile)
      .where(eq(studentProfile.userId, userRecord.id));
    if (!studentProfileRecord) {
      redirect("/sign-up/onboarding/student");
    }
    redirect("/dashboard/student");
  }

  if (userRecord.role === "mentor") {
    const [mentorProfileRecord] = await db
      .select()
      .from(mentorProfile)
      .where(eq(mentorProfile.userId, userRecord.id));
    if (!mentorProfileRecord) {
      redirect("/sign-up/onboarding/mentor");
    }

    if (mentorProfileRecord.verifiedStatus === "pending") {
      redirect("/waitlist");
    }
    if (mentorProfileRecord.verifiedStatus === "rejected") {
      redirect("/rejected");
    }
    redirect("/dashboard/mentor");
  }

  redirect("/admin/dashboard");
}
