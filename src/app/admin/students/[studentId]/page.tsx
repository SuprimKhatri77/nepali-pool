import { requireAdmin } from "../../../../../server/lib/auth/guards";
import AdminStudentSpecific from "@/components/admin/students/AdminStudentSpecific";
import { AdminNotFound } from "@/components/admin/AdminNotFound";
import { db } from "../../../../../lib/db";
import { studentProfile } from "../../../../../lib/db/schema";
import { StudentProfileWithUser } from "../../../../../types/all-types";

export default async function MentorSpecificServer({
  params,
}: {
  params: Promise<{studentId: string}>
}) {
  await requireAdmin();

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
         return (
           <AdminNotFound
             title="Student not found"
             backHref="/admin/students"
             backLabel="Back to students"
           />
         );
       }
     

    

 

  return <AdminStudentSpecific studentDetail={studentDetail} />;
}
