import { Card, CardContent } from "@/components/ui/card"
import { XCircle } from "lucide-react"
import { db } from "../../../../../lib/db"
import { mentorProfile } from "../../../../../lib/db/schema"
import MentorApplication from "@/components/MentorApplication"


export default async function ApplicationPage({
    params,
}: {
    params: Promise<{ applicationId: string }>
}) {
    const { applicationId } = await params

    const mentorProfileRecordWithUser = await db.query.mentorProfile.findFirst({
        where: (fields, { eq }) => eq(mentorProfile.userId, applicationId),
        with: {
            user: true,
        },
    })

    if (!mentorProfileRecordWithUser) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <XCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
                            <h2 className="text-lg font-semibold mb-2">Application Not Found</h2>
                            <p className="text-muted-foreground">No record found for this application ID.</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return <MentorApplication mentorProfileRecordWithUser={mentorProfileRecordWithUser} />

}
