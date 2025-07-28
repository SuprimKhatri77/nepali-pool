"use client"

import { Button } from "@/components/ui/button";
import { authClient } from "../../server/lib/auth/auth-client";
import { useRouter } from "next/navigation";
import { useActionState, useState } from "react";
import { MentorProfileSelectType, StudentProfileSelectType, UserSelectType } from "../../lib/db/schema";
import Image from "next/image";
import { addToFavorite, FormState } from "../../server/actions/addToFavorite";

type MentorProfileWithUser = MentorProfileSelectType & {
    user: UserSelectType
}

type StudentProfileWithUser = StudentProfileSelectType & {
    user: UserSelectType
}

export default function StudentPage({ matchingMentors, studentRecordWithUser }: { matchingMentors: MentorProfileWithUser[], studentRecordWithUser: StudentProfileWithUser }) {
    const [click, setClick] = useState(false)
    const router = useRouter()
    const [isFavoritesShown, setIsFavoriteShown] = useState<boolean>(false)
    const initialState: FormState = {
        errors: {}
    } as FormState

    const [state, formAction, isPending] = useActionState<FormState, FormData>(addToFavorite, initialState)



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
            <div className="flex">
                <div>

                    <h1 className="bg-green-400 h-fit" onClick={() => setIsFavoriteShown(false)}>Matching mentors</h1>

                    {matchingMentors.length > 0 ? (
                        !isFavoritesShown && (
                            <div className="flex flex-col gap-5">
                                <div className="flex flex-wrap gap-5 items-center">
                                    {matchingMentors.map((mentor) => (
                                        <div key={mentor.userId} className="flex flex-col gap-5 items-center bg-gray-100 py-5 px-7 rounded-xl">
                                            <div className="flex flex-col items-center gap-5">
                                                <Image src={mentor.imageUrl!} alt="" width={100} height={100} className="rounded-full object-center" />
                                                <p>Name: {mentor.user.name}</p>
                                            </div>
                                            <p>Bio: {mentor.bio}</p>
                                            <p>Country: {mentor.country}</p>
                                            <form action={formAction}>
                                                <Button type="submit" disabled={isPending}>
                                                    {isPending ? "Adding...." : "Add to favorite"}
                                                </Button>
                                                <input type="hidden" name="mentorId" value={mentor.userId} />
                                                <input type="hidden" name="studentId" value={studentRecordWithUser.userId} />
                                            </form>
                                        </div>

                                    ))}

                                </div>
                            </div>
                        )
                    ) : "No mentors found for your provided favorite destination."}
                </div>

                <div className="" onClick={() => setIsFavoriteShown(true)}>
                    <h1 className="">Favorites</h1>
                </div>
            </div>
        </div>
    )
}