import { db } from "../../../../../lib/db";
import { mentorProfile } from "../../../../../lib/db/schema";
import { and,  ne, or } from "drizzle-orm";
import AdminMentorSpecific from "@/components/admin/mentors/AdminMentorSpecific";

export default async function MentorSpecificServer({
  params,
}: {
  params: Promise<{mentorId: string}>
}) {

      const {mentorId} = await params;
      console.log(mentorId)

      const mentorDetail = await db.query.mentorProfile.findFirst({
        where: (fields, {
          eq
        }) => eq(mentorProfile.userId, mentorId),
          with: {
            user: true
          }
        
      })
       if(!mentorDetail){
       return  <div>
          <h1>Mentor Detail not found!.</h1>
        </div>
       }
      const matchingMentors = await db.query.mentorProfile.findMany({
        where: (fields, {
          eq
        }) => and (ne(mentorProfile.userId, mentorDetail.userId), or(eq(mentorProfile.city, mentorDetail.city!),  eq(mentorProfile.country, mentorDetail.country!))),
        with: {
          user: true
        }
      })

    

 

  return <AdminMentorSpecific mentorDetail={mentorDetail} matchingMentors={matchingMentors}/>;
}
