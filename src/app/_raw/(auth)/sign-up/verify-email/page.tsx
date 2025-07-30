import { headers } from "next/headers"
import { auth } from "../../../../../../server/lib/auth/auth"
import { db } from "../../../../../../lib/db"
import { eq } from "drizzle-orm"
import { mentorProfile, studentProfile, user } from "../../../../../../lib/db/schema"
import { notFound, redirect } from "next/navigation"
import VerifyEmail from "@/components/VerifyEmail"

interface PageProps {
    searchParams: { email?: string }
}

export default async function VerifyEmailPage({ searchParams }: PageProps) {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session) {
        return redirect("/login")
    }

    const [userRecord] = await db.select().from(user).where(eq(user.id, session.user.id))

    if (!userRecord) {
        return redirect("/login")
    }

    if (!userRecord.emailVerified) {

        return <VerifyEmail email={userRecord.email} />
    }

    if (!userRecord.role || userRecord.role === "none") {
        return redirect("/select-role")
    }

    if (userRecord.role === "admin") {
        return redirect("/admin/dashboard")
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
            return redirect("/wailtist")
        }
        if (mentorProfileRecord.verifiedStatus === "rejected") {
            return redirect("/rejected")
        }
        return redirect("/dashboard/mentor")
    }


    return notFound()


}
