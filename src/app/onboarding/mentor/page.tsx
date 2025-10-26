import MentorOnboardingForm from "@/components/OnboardingMentorForm";
import { auth } from "../../../../server/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "../../../../lib/db";
import { mentorProfile, user } from "../../../../lib/db/schema";
import { eq } from "drizzle-orm";
import { redirectWithMessage } from "../../../../server/lib/auth/helpers/redirect-with-message";

export default async function OnboardingMentor() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return redirectWithMessage("/login", "Please login to continue.");
  }

  const [userRecord] = await db
    .select()
    .from(user)
    .where(eq(user.id, session.user.id));
  if (!userRecord) {
    await auth.api.signOut({ headers: await headers() });
    return redirectWithMessage("/login", "Please login to continue.");
  }

  if (!userRecord.emailVerified) {
    return redirectWithMessage(
      "/verify-email",
      "Please verify your email to continue."
    );
  }

  if (!userRecord.role || userRecord.role === "none") {
    return redirectWithMessage("/select-role", "Please select a valid role.");
  }

  if (userRecord.role === "admin") {
    return redirect("/admin/dashboard");
  }

  if (userRecord.role === "student") {
    return redirect("/dashboard/student");
  }

  const [mentorProfileRecord] = await db
    .select()
    .from(mentorProfile)
    .where(eq(mentorProfile.userId, session.user.id));
  if (mentorProfileRecord) {
    if (mentorProfileRecord.verifiedStatus === "pending") {
      return redirect("/waitlist");
    }
    if (mentorProfileRecord.verifiedStatus === "rejected") {
      return redirect("/rejected");
    }
    return redirect("/dashboard/mentor");
  }

  return <MentorOnboardingForm currentUserId={userRecord.id} />;
}
