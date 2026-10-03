import { requireAdmin } from "../../../../server/lib/auth/guards";

import MentorApplications from "@/components/MentorApplications";
import { db } from "../../../../lib/db";
import NoMentorApplications from "@/components/admin/mentors/NoApplications";

export default async function Page() {
    await requireAdmin()
    
    const mentorProfileWithUser = await db.query.mentorProfile.findMany({
        where: (fields, { ne }) => ne(fields.verifiedStatus, "accepted"),
        with: {
            user: true
        }
    })



    if (mentorProfileWithUser.length === 0) {
        return <NoMentorApplications />
    }


    return <MentorApplications mentorProfileWithUser={mentorProfileWithUser} />

}