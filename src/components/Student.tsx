"use client"

import { Button } from "@/components/ui/button";
import { authClient } from "../../server/lib/auth/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MentorProfileSelectType, UserSelectType } from "../../lib/db/schema";
import Image from "next/image";

type MentorProfileWithUser = MentorProfileSelectType & {
    user: UserSelectType
}

export default function StudentPage({ matchingMentors }: { matchingMentors: MentorProfileWithUser[] }) {
    const [click, setClick] = useState(false)
    const router = useRouter()



    const handleClick = async () => {
        setClick(true)
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/")
                }
            }
        })
        setClick(false)
    }
    return (
        <div className="flex flex-col gap-4 min-h-screen items-center justify-center">
            Sup student!
            <Button onClick={handleClick} disabled={click}>Logout</Button>
            <div className="">
                {matchingMentors.length > 0 ? (
                    <div className="flex flex-col gap-5">
                        <h1>Matching mentors</h1>
                        <div className="flex flex-wrap gap-5 items-center">
                            {matchingMentors.map((mentor) => (
                                <div key={mentor.userId} className="flex flex-col gap-5 items-center">
                                    <div className="flex flex-col items-center gap-5">
                                        <Image src={mentor.imageUrl!} alt="" width={100} height={100} className="rounded-full object-center" />
                                        <p>Name: {mentor.user.name}</p>
                                    </div>
                                    <p>Bio: {mentor.bio}</p>
                                    <p>Country: {mentor.country}</p>

                                </div>

                            ))}
                        </div>
                    </div>
                ) : "No mentors found for your provided favorite destination."}
            </div>
        </div>
    )
}