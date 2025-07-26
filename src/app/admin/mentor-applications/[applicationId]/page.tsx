import ApplicationProfile from "@/components/orginal-components/ApplicationProfile"
import { db } from "../../../../../lib/db"
import { mentorProfile } from "../../../../../lib/db/schema"
// D:\RW_Projects\nepali-pool\src\components\orginal-components\ApplicationProfile.tsx


export default async function MentorProfile({params,}: {params: Promise<{applicationId: string}>}) {
   const {applicationId}= await params

   const mentorProfileRecordWithUser = await db.query.mentorProfile.findFirst({
       where: (fields, { eq }) => eq(mentorProfile.userId, applicationId),
       with: {
           user: true,
       },
   })
    return <ApplicationProfile mentorProfileRecordWithUser={mentorProfileRecordWithUser}/>
}