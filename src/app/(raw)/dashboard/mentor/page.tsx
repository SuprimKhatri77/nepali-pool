import { headers } from "next/headers"
import { auth } from "../../../../../server/lib/auth/auth"
import { redirect } from "next/navigation"
import { db } from "../../../../../lib/db"
import { mentorProfile, studentProfile, user } from "../../../../../lib/db/schema"
import { eq } from "drizzle-orm"
import MentorPage from "@/components/Mentor"




export default async function Mentor() {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session) {
        return redirect("/login")
    }

    const [userRecord] = await db.select().from(user).where(eq(user.id, session.user.id))
    const [mentorProfileRecord] = await db.select().from(mentorProfile).where(eq(mentorProfile.userId, userRecord.id))
    const [studentProfileRecord] = await db.select().from(studentProfile).where(eq(studentProfile.userId, userRecord.id))


    if (!userRecord.emailVerified) {
        return redirect(`/sign-up/verify-email?email=${encodeURIComponent(session.user.email)}`)
    }

    if (userRecord.role === "none") {
        return redirect(`/select-role?email=${encodeURIComponent(userRecord.email)}`)
    }

    if (userRecord.role === "student") {
        if (!studentProfileRecord) {
            return redirect(`/sign-up/onboarding/student`)
        }
        return redirect("/dashboard/student")
    }

    if (userRecord.role === "admin") {
        return redirect("/admin")
    }

    if (userRecord.role === "mentor") {
        if (!mentorProfileRecord) {
            return redirect("/sign-up/onboarding/mentor")
        }
        if (mentorProfileRecord.verifiedStatus === "pending") {
            return redirect("/waitlist")
        }
        if (mentorProfileRecord.verifiedStatus === "rejected") {
            return redirect("/rejected")
        }
        return <MentorPage />
    }




    return redirect(`/select-role?email=${encodeURIComponent(session.user.email)}`)
}