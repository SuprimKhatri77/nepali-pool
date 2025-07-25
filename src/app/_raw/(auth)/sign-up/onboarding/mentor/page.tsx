import MentorOnboardingForm from "@/components/OnboardingMentorForm";
import { auth } from "../../../../../../../server/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "../../../../../../../lib/db";
import { mentorProfile, user } from "../../../../../../../lib/db/schema";
import { eq } from "drizzle-orm";

export default async function OnboardingMentor() {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session) {
        return redirect("/login")
    }

    const [userRecord] = await db.select().from(user).where(eq(user.id, session.user.id))
    if (!userRecord) {
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
        if (mentorProfileRecord.verifiedStatus === "pending") {
            return redirect("/waitlist")
        }
        if (mentorProfileRecord.verifiedStatus === "rejected") {
            return redirect("/rejected")
        }
        return redirect("/dashboard/mentor")
    }

    return <MentorOnboardingForm currentUserId={userRecord.id} />

}