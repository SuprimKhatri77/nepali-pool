import { db } from "../../../../../lib/db";
import AdminStudentSpecific from "@/components/admin/students/AdminStudentSpecific";
import { studentProfile } from "../../../../../lib/db/schema";

export default async function MentorSpecificServer({
  params,
}: {
  params: Promise<{studentId: string}>
}) {

      const {studentId} = await params;
      console.log(studentId)

      const studentDetail = await db.query.studentProfile.findFirst({
        where: (fields, {
          eq
        }) => eq(studentProfile.userId, studentId),
          with: {
            user: true,
            
          },
          
        
      })
       if(!studentDetail){
       return  <div>
          <h1>Student Detail not found!.</h1>
        </div>
       }
     

    

 

  return <AdminStudentSpecific studentDetail={studentDetail} />;
}
