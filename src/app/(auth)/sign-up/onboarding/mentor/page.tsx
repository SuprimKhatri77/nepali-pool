import MentorOnboardingForm from "@/components/orginal-components/MentorOnboardingForm";
import { auth } from "../../../../../../server/lib/auth/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { db } from "../../../../../../lib/db";
import { mentorProfile, user } from "../../../../../../lib/db/schema";
import { eq } from "drizzle-orm";

export  default async function onboardingMentorPage(){
  const session = await auth.api.getSession({
    headers: await headers()
  })
  if (!session) {
          return redirect("/login")
      }

  const [userRecord]= await db.select().from(user).where(eq(user.id, session.user.id))

  if(!userRecord){
    return redirect("/sign-up")
  }


      if (!userRecord.emailVerified) {
          return redirect(`/sign-up/verify-email?email=${encodeURIComponent(userRecord.email)}`)
      }
  
      if (userRecord.role === "none") {
          return redirect("/select-role")
      }
      if (userRecord.role === "student") {
          return redirect("/sign-up/onboarding/student")
      }
  
      const [mentorProfileRecord] = await db.select().from(mentorProfile).where(eq(mentorProfile.userId, session.user.id))
      if (mentorProfileRecord) {
          return redirect("/dashboard/mentor")
      }
  return  <MentorOnboardingForm currentUserId={session.user.id}/>
   
}