export const revalidate = 3600;

import { getStudentProfiles } from "../../../server/helper/connect-student/get-student-profile";
import { ConnectStudents } from "@/components/students/connect-students/connect-students";

export default async function page() {
  const { hasCurrentUserProfile, hasSession, role } =
    await getStudentProfiles();
  return (
    <ConnectStudents
      hasSession={hasSession}
      hasCurrentUserProfile={hasCurrentUserProfile}
      role={role}
    />
  );
}
