import { Card, CardContent } from "@/components/ui/card"
import { XCircle } from "lucide-react"
import { db } from "../../../../../lib/db"
import { mentorProfile, studentProfile, user } from "../../../../../lib/db/schema"
import MentorApplication from "@/components/MentorApplication"
import { auth } from "../../../../../server/lib/auth/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { eq } from "drizzle-orm"


export default async function ApplicationPage({
    params,
}: {
    params: Promise<{ applicationId: string }>
}) {

    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session) {
        return redirect("/login?toast=Please+log+in+to+continue")
    }

    const [userRecord] = await db.select().from(user).where(eq(user.id, session.user.id))

    if (!userRecord) {
        return redirect("/sign-up?toast=Please+create+an+account+to+continue")
    }

    if (!userRecord.emailVerified) {
        return redirect(`/sign-up/verify-email?email=${encodeURIComponent(userRecord.email)}`)
    }

    if (!userRecord.role || userRecord.role === "none") {
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




    const { applicationId } = await params

    const mentorProfileRecordWithUser = await db.query.mentorProfile.findFirst({
        where: (fields, { eq }) => eq(mentorProfile.userId, applicationId),
        with: {
            user: true,
        },
    })

    if (!mentorProfileRecordWithUser) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <XCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
                            <h2 className="text-lg font-semibold mb-2">Application Not Found</h2>
                            <p className="text-muted-foreground">No record found for this application ID.</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return <MentorApplication mentorProfileRecordWithUser={mentorProfileRecordWithUser} />

}
