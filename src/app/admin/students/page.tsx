import { requireAdmin } from "../../../../server/lib/auth/guards";
import { db } from "../../../../lib/db";
import { StudentProfileWithUser } from "../../../../types/all-types";
import AdminStudents from "@/components/admin/students/AdminStudents";

export default async function Page() {
  await requireAdmin();

  const students: Omit<StudentProfileWithUser, "videoCall">[] =
    await db.query.studentProfile.findMany({
      with: {
        user: true,
      },
    });

  return <AdminStudents students={students} />;
}
