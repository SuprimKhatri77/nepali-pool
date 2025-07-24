"use client"

import { MentorProfileSelectType, UserSelectType } from "../../lib/db/schema"
import Link from "next/link"
import { Button } from "./ui/button"
import { authClient } from "../../server/lib/auth/auth-client"
import { useRouter } from "next/navigation"
import SignOutButton from "./SignOutButton"

type MentorProfileWithUser = MentorProfileSelectType & {
    user: UserSelectType
}

export default function AdminPage({ mentorProfileWithUser }: { mentorProfileWithUser: MentorProfileWithUser[] }) {






    return (
        <div>
            <div>Who let you come here dwag? You sure don't look like an admin though! Whatever !!!</div>
            <SignOutButton />
            {mentorProfileWithUser.length !== 0 && (


                <h1>Pending mentor lists</h1>
            )}
            <div className="flex flex-wrap items-center justify-center">
                {mentorProfileWithUser.length === 0 ? (<div>
                    <p>No pending request for mentor applications!</p>
                </div>) : (
                    mentorProfileWithUser.map((mentor) => (
                        <div key={mentor.userId} className="bg-gray-200 py-5 px-7 rounded-lg flex flex-col gap-2 items-center">
                            <p>{mentor.user.name}</p>
                            <div className="flex gap-1">
                                Status:
                                <p className={`${mentor.verifiedStatus === "rejected" ? "text-red-500" : "text-blue-400"} capitalize`}>{mentor.verifiedStatus}</p>
                            </div>
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