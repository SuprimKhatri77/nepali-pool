import { db } from "../../lib/db"
import { mentorProfile, MentorProfileSelectType, user } from "../../lib/db/schema"
import { redirect } from "next/navigation"
import { auth } from "../../server/lib/auth/auth"
import { headers } from "next/headers"
import Link from "next/link"

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
                                <Link href={`/mentor-applications/${mentor.userId}`} className="bg-blue-400 py-2 px-4 rounded-lg hover:bg-blue-500 transition-all duration-300 ease-in">View Details</Link>

                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>

    )
}