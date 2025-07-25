import { LoginForm } from "@/components/login-form"
import { auth } from "../../../../../server/lib/auth/auth"
import { headers } from "next/headers"
import { db } from "../../../../../lib/db"
import { mentorProfile, studentProfile, user } from "../../../../../lib/db/schema"
import { eq } from "drizzle-orm"
import { notFound, redirect } from "next/navigation"

export default async function Page() {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session) {
        return (
            <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
                <div className="w-full max-w-sm">
                    <LoginForm />
                </div>
            </div>
        )
    }

    const [userRecord] = await db.select().from(user).where(eq(user.id, session.user?.id))

    if (!userRecord) {
        return redirect("/sign-up")
    }

    if (!userRecord.emailVerified) {
        return redirect(`/sign-up/verify-email?email=${encodeURIComponent(userRecord.email)}`)
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
            return redirect("/waitlist")
        }
        if (mentorProfileRecord.verifiedStatus === "rejected") {
            return redirect("/rejected")
        }
        return redirect("/dashboard/mentor")
    }


    return notFound()



}
