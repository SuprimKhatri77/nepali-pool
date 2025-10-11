import { headers } from "next/headers"
import { auth } from "../../../../../server/lib/auth/auth"
import { redirect } from "next/navigation"
import { db } from "../../../../../lib/db"
import { user } from "../../../../../lib/db/schema"
import { eq } from "drizzle-orm"
import MentorPage from "@/components/Mentor"
import Student from "@/app/dashboard/student/page"

export default async function Dashboard() {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session) {
        return redirect("/login")
    }

    const [userRecord] = await db.select().from(user).where(eq(user.id, session.user.id))
    if (userRecord.role === "student") {
        return <Student  />
    } else if (userRecord.role === "mentor") {
        return <MentorPage />
    } else if (userRecord.role === "none") {
        return redirect("/select-role")
    } else {
        return redirect("/admin")
    }
}