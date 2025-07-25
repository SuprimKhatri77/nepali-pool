import { headers } from "next/headers"
import { auth } from "../../../../../server/lib/auth/auth"
import { redirect } from "next/navigation"
import { db } from "../../../../../lib/db"
import { mentorProfile, studentProfile, user } from "../../../../../lib/db/schema"
import { eq } from "drizzle-orm"
import SignOutButton from "@/components/SignOutButton"
import MentorApplications from "@/components/MentorApplications"

export default async function Page() {
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
        const [studentProfileRecord] = await db.select().from(studentProfile).where(eq(studentProfile.userId, userRecord.id))
        if (!studentProfileRecord) {
            return redirect("/sign-up/onboarding/student")
        }
        return redirect("/dashboard/student")
    }
    if (userRecord.role === "mentor") {
        const [mentorProfileRecord] = await db.select().from(mentorProfile).where(eq(mentorProfile.userId, userRecord.id))
        if (!mentorProfileRecord) {
            return redirect("/sign-up/onboarding/mentor")
        }

        if (mentorProfileRecord.verifiedStatus === "pending") {
            return redirect("/waitlist")
        }
        if (mentorProfileRecord.verifiedStatus === "rejected") {
            return redirect("/rejected")
        }
        return redirect("/dashboard/mentor")
    }


    const mentorProfileWithUser = await db.query.mentorProfile.findMany({
        where: (fields, { ne }) => ne(fields.verifiedStatus, "accepted"),
        with: {
            user: true
        }
    })



    if (mentorProfileWithUser.length === 0) {
        return (
            <div className="flex flex-col min-h-screen justify-center items-center gap-4 max-w-2xl mx-auto">
                <div>Who let you come here dwag? You sure don't look like an admin though! Whatever !!!</div>
                <SignOutButton />
                <p>No pending request for mentor applications!</p>
            </div>
        )
    }



    return <MentorApplications mentorProfileWithUser={mentorProfileWithUser} />

}