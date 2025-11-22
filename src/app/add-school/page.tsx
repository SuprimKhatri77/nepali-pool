import AddSchool from "@/components/AddSchool";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { auth } from "../../../server/lib/auth/auth";
import { db } from "../../../lib/db";
import { mentorProfile, studentProfile, user } from "../../../lib/db/schema";



export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return redirect("/login?message=Please+login+to+continue");
  }

  const [userRecord] = await db
    .select()
    .from(user)
    .where(eq(user.id, session.user.id));
  if (!userRecord) {
    return redirect("/login?message=Please+login+to+add+school");
  }

  if (!userRecord.emailVerified) {
    return redirect("/sign-up/verify-email?message=Verify+your+email+to+continue");
  }
  if (!userRecord.role || userRecord.role === "none") {
    return redirect("/select-role?message=Select+your+role+to+continue");
  }

  if (userRecord.role === "student") {
    const [studentProfileRecord] = await db
      .select()
      .from(studentProfile)
      .where(eq(studentProfile.userId, userRecord.id));
    if (!studentProfileRecord) {
      return redirect("/sign-up/onboarding/student?message=Complete+onboarding+to+continue");
    }
    return redirect("/dashboard/student");
  }
  if (userRecord.role === "mentor") {
    return    <AddSchool currentUserId={userRecord.id} />
    // const [mentorProfileRecord] = await db
    //   .select()
    //   .from(mentorProfile)
    //   .where(eq(mentorProfile.userId, userRecord.id));
    // if (!mentorProfileRecord) {
    //   return redirect("/sign-up/onboarding/mentor?message=Complete+onboarding+to+continue");
    // }
    // if (mentorProfileRecord.verifiedStatus === "pending") {
    //   return redirect("/waitlist");
    // }
    // if (mentorProfileRecord.verifiedStatus === "rejected") {
    //   return redirect("/rejected?message=Sorry+sir+your+application+is+rejected");
    // }
    // return <AddSchool currentUserId={userRecord.id} />;
  }

  return <AddSchool currentUserId={userRecord.id} />;
}
