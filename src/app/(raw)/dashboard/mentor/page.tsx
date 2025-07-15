import { headers } from "next/headers"
import { auth } from "../../../../../server/lib/auth/auth"
import { redirect } from "next/navigation"
import { db } from "../../../../../lib/db"
import { user } from "../../../../../lib/db/schema"
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

    if (!userRecord.emailVerified) {
        return redirect(`sign-up/verify-email?email=${encodeURIComponent(session.user.email)}`)
    }

    if (userRecord.role === "none") {
        return redirect("/select-role")
    }

    if (userRecord.role === "student") {
        return redirect("/dashboard/student")
    }

    if (userRecord.role === "admin") {
        return redirect("/admin")
    }

    if (userRecord.role === "mentor") {

        return <MentorPage />
    }

    return redirect("/select-role")
}