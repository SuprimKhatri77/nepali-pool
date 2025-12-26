import ConnectStudentHero from "@/components/students/connect-students/Hero";
import StudentDetailForm from "@/components/students/connect-students/StudentDetailForm";
import {
  ConnectStudentProfileSelectType,
  UserSelectType,
} from "../../../../lib/db/schema";

type Props = {
  students:
    | (ConnectStudentProfileSelectType & {
        user: UserSelectType | null;
      })[]
    | [];
  hasCurrentUserProfile: boolean;
  hasSession: boolean;
};
export function ConnectStudents({
  students,
  hasCurrentUserProfile,
  hasSession,
}: Props) {
  return (
    <>
      <section className="min-h-[90%]">
        <ConnectStudentHero hasCurrentUserProfile={hasCurrentUserProfile} students={students} />
      </section>

      {/* show this form to student  when first time coming to this page. */}
      {!hasCurrentUserProfile && hasSession && <StudentDetailForm />}
    </>
  );
}
