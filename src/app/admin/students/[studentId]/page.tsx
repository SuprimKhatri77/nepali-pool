import AdminStudentSpecific from "@/components/admin/students/AdminStudentSpecific";
import { db } from "../../../../../lib/db";
import { studentProfile } from "../../../../../lib/db/schema";
import { StudentProfileWithUser } from "../../../../../types/all-types";

export default async function MentorSpecificServer({
  params,
}: {
  params: Promise<{studentId: string}>
}) {

      const {studentId} = await params;

      const studentDetail: Omit<StudentProfileWithUser, "videoCall"> | undefined = await db.query.studentProfile.findFirst({
        where: (fields, {
          eq
        }) => eq(studentProfile.userId, studentId),
          with: {
            user: true
          },
          
        
      })
       if(!studentDetail){
       return  <div>
          <h1>Student Detail not found!.</h1>
        </div>
       }
     

    

 

  return <AdminStudentSpecific studentDetail={studentDetail} />;
}
