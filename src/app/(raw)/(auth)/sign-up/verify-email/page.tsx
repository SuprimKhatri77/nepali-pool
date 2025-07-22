import { headers } from "next/headers"
import { auth } from "../../../../../../server/lib/auth/auth"
import { db } from "../../../../../../lib/db"
import { eq } from "drizzle-orm"
import { user } from "../../../../../../lib/db/schema"
import { redirect } from "next/navigation"
import VerifyEmail from "@/components/VerifyEmail"

interface PageProps {
    searchParams: { email?: string }
}

export default async function VerifyEmailPage({ searchParams }: PageProps) {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (session) {
        const [userRecord] = await db.select().from(user).where(eq(user.id, session.user.id))

        if (!userRecord) {
            return redirect("/login")
        }

        if (userRecord.emailVerified) {
            if (userRecord.role === "student") {
                return redirect("/dashboard/student")
            } else if (userRecord.role === "mentor") {
                return redirect("/dashboard/mentor")
            } else if (userRecord.role === "admin") {
                return redirect("/admin")
            } else if (userRecord.role === "none") {
                return redirect(`/select-role?email=${encodeURIComponent(userRecord.email)}`)
            }
        }

        return <VerifyEmail />
    }

    const emailFromUrl = await searchParams

    if (!emailFromUrl.email) {
        return redirect("/login")
    }

    const [userRecord] = await db.select().from(user).where(eq(user.email, emailFromUrl.email))

    if (!userRecord) {
        return redirect("/sign-up")
    }

    if (userRecord.emailVerified) {
        return redirect("/login")
    }

    return <VerifyEmail />
}
