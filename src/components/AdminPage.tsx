import { ne } from "drizzle-orm"
import { db } from "../../lib/db"
import { mentorProfile, MentorProfileSelectType } from "../../lib/db/schema"
import { redirect } from "next/navigation"
import { auth } from "../../server/lib/auth/auth"
import { headers } from "next/headers"
import { Button } from "./ui/button"

export default async function AdminPage() {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session) {
        return redirect("/login")
    }
    const mentorProfileWithUser = await db.query.mentorProfile.findMany({
        where: (fields, { ne }) => ne(fields.verifiedStatus, "accepted"),
        with: {
            user: true
        }
    })


    return (
        <div>

            <div>Who let you come here dwag? You sure don't look like an admin though! Whatever !!!</div>
            <h1>Pending mentor lists</h1>
            <div className="flex flex-wrap items-center justify-center">
                {mentorProfileWithUser.length === 0 ? "No pending list" : (
                    mentorProfileWithUser.map((mentor) => (
                        <div key={mentor.userId} className="bg-gray-200 py-5 px-7 rounded-lg flex flex-col gap-2 items-center">
                            <p>{mentor.user.name}</p>
                            <div className="flex gap-2">

                                <Button>Accept</Button>
                                <Button variant="destructive">Reject</Button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>

    )
}