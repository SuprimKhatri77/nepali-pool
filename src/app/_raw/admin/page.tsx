import { headers } from "next/headers"
import { auth } from "../../../../server/lib/auth/auth"
import { redirect } from "next/navigation"
import { db } from "../../../../lib/db"
import { user } from "../../../../lib/db/schema"
import { eq } from "drizzle-orm"
import AdminPage from "@/components/AdminPage"
import { Button } from "@/components/ui/button"
import SignOutButton from "@/components/SignOutButton"

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
    if (userRecord.role === "student") {
        return redirect("/dashboard/student")
    }
    if (userRecord.role === "mentor") {
        return redirect("/dashboard/mentor")
    }
    if (session && userRecord.role === "none") {
        return redirect(`/select-role?email=${encodeURIComponent(session.user.email)}`)
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



    return <AdminPage mentorProfileWithUser={mentorProfileWithUser} />

}