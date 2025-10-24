
import { db } from "../../../../lib/db";
import { MentorProfileWithUser } from "../../../../types/all-types";
import AdminMentors from "@/components/admin/mentors/AdminMentor";
import { getCountsByDate } from "../dashboard/page";

// import TopMentorsFrom from "@/components/mentors/TopMentorsFrom";


export default async function Page() {

  
    
  
      const mentors: MentorProfileWithUser[] =
      await db.query.mentorProfile.findMany({
        with: {
          user: true,
        },
      });
  
        const mentorsProfile = await db.query.mentorProfile.findMany()
    
    const students =  await db.query.studentProfile.findMany()


    const startDate = new Date("2025-01-01"); 
const endDate = new Date("2025-10-31");

const chartDataWithCounts = getCountsByDate(startDate, endDate, mentorsProfile, students);
  
    return <AdminMentors mentors={mentors} chartData={chartDataWithCounts} />
  
}
