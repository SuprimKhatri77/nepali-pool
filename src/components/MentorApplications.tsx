import Link from "next/link"
import { MentorProfileSelectType, UserSelectType } from "../../lib/db/schema"

type MentorProfileWithUser = MentorProfileSelectType & {
    user: UserSelectType
}

export default function MentorApplications({ mentorProfileWithUser }: { mentorProfileWithUser: MentorProfileWithUser[] }) {
    return (
        <div className="flex flex-col min-h-screen gap-5 items-center justify-center">
            {mentorProfileWithUser.length === 0 ? (<div>
                <p>No pending request for mentor applications!</p>
            </div>) : (
                <>
                    <h1>Pending Mentor List</h1>
                    {
                        mentorProfileWithUser.map((mentor) => (
                            <div key={mentor.userId} className="bg-gray-200 py-5 px-7 rounded-lg flex flex-col gap-2 items-center">
                                <p>{mentor.user.name}</p>
                                <div className="flex gap-1">
                                    Status:
                                    <p className={`${mentor.verifiedStatus === "rejected" ? "text-red-500" : "text-blue-400"} capitalize`}>{mentor.verifiedStatus}</p>
                                </div>
                                <div className="flex gap-2">
                                    <Link href={`/admin/mentor-applications/${mentor.userId}`} className="bg-blue-400 py-2 px-4 rounded-lg hover:bg-blue-500 transition-all duration-300 ease-in">View Details</Link>

                                </div>
                            </div>
                        ))}
                </>
            )}
        </div>
    )
}