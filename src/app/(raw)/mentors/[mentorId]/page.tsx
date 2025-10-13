import MentorSpecific from "@/components/mentors/MentorSpecific/MentorSpecific";
import { db } from "../../../../../lib/db";
import { mentorProfile, studentProfile, user } from "../../../../../lib/db/schema";
import { redirect } from "next/navigation";
import { and,  ne, or } from "drizzle-orm";
import { auth } from "../../../../../server/lib/auth/auth";
import { headers } from "next/headers";

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
      console.log(mentorDetail)
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
 

  return <MentorSpecific mentorDetail={mentorDetail} matchingMentors={matchingMentors}/>;
}
