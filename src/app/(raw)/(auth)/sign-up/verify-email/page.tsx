import { headers } from "next/headers"
import { auth } from "../../../../../../server/lib/auth/auth"
import { Button } from "@/components/ui/button"
import { db } from "../../../../../../lib/db"
import { eq } from "drizzle-orm"
import { user } from "../../../../../../lib/db/schema"
import { redirect } from "next/navigation"
import VerifyEmail from "@/components/VerifyEmail"

export default async function VerifyEmailPage() {
    const session = await auth.api.getSession({
        headers: await headers()
    })


    if (!session) {
        return redirect("/login")
    }

    const [userRecord] = await db.select().from(user).where(eq(user.id, session?.user.id))
    if (!userRecord) {
        return redirect("/login")
    }

    if (userRecord.emailVerified) {
        if (userRecord.role === "none") {
            return redirect("/select-role")
        }

        if (userRecord.role === "student") {
            return redirect("/dashboard/student")
        }

        if (userRecord.role === "mentor") {
            return redirect("/dashboard/mentor")
        }

        if (userRecord.role === "admin") {
            return redirect("/admin")
        }

    }


    return <VerifyEmail />
}