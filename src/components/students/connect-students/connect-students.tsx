import StudentDetailForm from "@/components/students/connect-students/StudentDetailForm";
import { ConnectStudentHero } from "./Hero";

type Props = {
  hasCurrentUserProfile: boolean;
  hasSession: boolean;
  role: "student" | "mentor" | "admin" | null;
};
export function ConnectStudents({
  hasCurrentUserProfile,
  hasSession,
  role,
}: Props) {
  return (
    <>
      <section className="min-h-[90%]">
        <ConnectStudentHero
          hasCurrentUserProfile={hasCurrentUserProfile}
          hasSession={hasSession}
          role={role}
        />
      </section>

      {/* show this form to student  when first time coming to this page. */}
      {!hasCurrentUserProfile && hasSession && role === "student" && (
        <StudentDetailForm />
      )}
    </>
  );
}
