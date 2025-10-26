import MentorOnboardingForm from "@/components/OnboardingMentorForm";
import { auth } from "../../../../server/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "../../../../lib/db";
import { mentorProfile, studentProfile, user } from "../../../../lib/db/schema";
import { eq } from "drizzle-orm";

export default async function OnboardingMentor() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return redirect("/login");
  }

  const [userRecord] = await db
    .select()
    .from(user)
    .where(eq(user.id, session.user.id));
  if (!userRecord) {
    await auth.api.signOut({ headers: await headers() });
    return redirect("/login?error=invalid_session");
  }

  if (!userRecord.emailVerified) {
    return redirect("/verify-email");
  }

  if (!userRecord.role || userRecord.role === "none") {
    return redirect("/select-role");
  }

  if (userRecord.role === "admin") {
    return redirect("/admin/dashboard");
  }

  if (userRecord.role === "student") {
    const [studentProfileRecord] = await db
      .select()
      .from(studentProfile)
      .where(eq(studentProfile.userId, userRecord.id));
    if (!studentProfileRecord) {
      return redirect("/onboading/student");
    }
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
