import { requireViewer } from "../../../server/lib/auth/guards";
import { StudentProfile } from "@/components/student-profile";
import { MentorProfile } from "@/components/mentor-profile";

export default async function Page() {
  const viewer = await requireViewer(["student", "mentor"]);

  if (viewer.status === "student") {
    return (
      <StudentProfile
        studentRecord={{ ...viewer.studentProfile, user: viewer.user }}
      />
    );
  }
  return (
    <MentorProfile
      mentorRecord={{ ...viewer.mentorProfile, user: viewer.user }}
    />
  );
}
