
import Mentors from "@/components/mentors/MENTORS";
import { db } from "../../../../lib/db";
import { MentorProfileWithUser } from "../../../../types/all-types";

// import TopMentorsFrom from "@/components/mentors/TopMentorsFrom";


export default async function Page() {

  
    
  
      const mentors: MentorProfileWithUser[] =
      await db.query.mentorProfile.findMany({
        with: {
          user: true,
        },
      });
  
     
  
    return <Mentors mentors={mentors} />
  
}
