
import { db } from "../../../../lib/db";
import { MentorProfileWithUser } from "../../../../types/all-types";

import Mentors from "@/components/mentors/Mentors";
// import TopMentorsFrom from "@/components/mentors/TopMentorsFrom";


export default async function Page() {

  
    
  
      const mentors: MentorProfileWithUser[] =
      await db.query.mentorProfile.findMany({
        with: {
          user: true,
        },
      });
      console.log(mentors)
  
     
  
    return <Mentors mentors={mentors} />
  
}
