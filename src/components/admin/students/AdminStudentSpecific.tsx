import { StudentProfileWithUser } from "../../../../types/all-types";
import AdminStudentProfile from "./AdminStudentProfile";

export default function AdminStudentSpecific({
  studentDetail,
}: {
  studentDetail: Omit<StudentProfileWithUser, "videoCall">;
}) {
  return (
    <main className="mb-4">
      <AdminStudentProfile studentDetail={studentDetail} />
    </main>
  );
}
