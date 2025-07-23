import { headers } from "next/headers"
import { auth } from "../../../../server/lib/auth/auth"
import { redirect } from "next/navigation"
import { db } from "../../../../lib/db"
import { user } from "../../../../lib/db/schema"
import { eq } from "drizzle-orm"
import AdminPage from "@/components/AdminPage"

export default async function Page() {

    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session) {
        return redirect("/login")
    }
    const [userRecord] = await db.select().from(user).where(eq(user.id, session.user.id))
    if (session && userRecord.role === "student") {
        return redirect("/dashboard/student")
    }
    if (session && userRecord.role === "mentor") {
        return redirect("/dashboard/mentor")
    }
    if (session && userRecord.role === "none") {
        return redirect(`/select-role?email=${encodeURIComponent(session.user.email)}`)
    }


    return <AdminPage />


}