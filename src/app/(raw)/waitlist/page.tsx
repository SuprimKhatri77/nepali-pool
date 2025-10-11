import SignOutButton from "@/components/SignOutButton";
import { auth } from "../../../../server/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "../../../../lib/db";
import { mentorProfile, studentProfile, user } from "../../../../lib/db/schema";
import { eq } from "drizzle-orm";

export default async function MentorWaitlist() {
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

    if (userRecord.role === "student") {
        const [studentProfileRecord] = await db.select().from(studentProfile).where(eq
            (studentProfile.userId, userRecord.id)
        )
        if (!studentProfileRecord) {
            return redirect("/sign-up/onboarding/student")
        }
        return redirect("/dashboard/student")
    }

    if (userRecord.role === "none") {
        return redirect("/select-role")
    }



    const [mentorProfileRecord] = await db.select().from(mentorProfile).where(eq(mentorProfile.userId, userRecord.id))
    if (!mentorProfileRecord && userRecord.role === "mentor") {
        return redirect(`/sign-up/onboarding/mentor`)
    }

    if (mentorProfileRecord.verifiedStatus === "rejected") {
        return redirect('/rejected')
    }

    if (mentorProfileRecord.verifiedStatus === "accepted") {
        return redirect("/dashboard/mentor")
    }
    return (
        <>
            <div>You'll be here on this page till you are verified by our lovely admins!</div>
            <SignOutButton />
        </>
    )
}