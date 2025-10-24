
import { db } from "../../../../lib/db";
import {  StudentProfileWithUser } from "../../../../types/all-types";
import { getCountsByDate } from "../dashboard/page";
import AdminStudents from "@/components/admin/students/AdminStudents";

// import TopMentorsFrom from "@/components/mentors/TopMentorsFrom";


export default async function Page() {

  
    
  
      const studentsForProps: Omit<StudentProfileWithUser, "videoCall">[] | [] =
      await db.query.studentProfile.findMany({
        with: {
          user: true,
        },
      });
  
        const mentorsProfile = await db.query.mentorProfile.findMany()
    
    const students =  await db.query.studentProfile.findMany()


    const startDate = new Date("2025-01-01"); 
const endDate = new Date("2025-10-31");

const chartDataWithCounts = getCountsByDate(startDate, endDate, mentorsProfile, students);
  
    return <AdminStudents students={studentsForProps} chartData={chartDataWithCounts} />
  
}
