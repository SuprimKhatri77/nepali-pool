import { redirect } from "next/navigation";
import { requireUser } from "../../../server/lib/auth/helpers/requireUser";
import { db } from "../../../lib/db";
import { mentorProfile, studentProfile } from "../../../lib/db/schema";
import { StudentProfile } from "@/components/student-profile";
import { MentorProfile } from "@/components/mentor-profile";

export default async function Page() {
  const userRecord = await requireUser();
  if (userRecord.role !== "student" && userRecord.role !== "mentor") {
    return redirect("/");
  }

  if (userRecord.role === "student") {
    const studentRecord = await db.query.studentProfile.findFirst({
      where: (fields, { eq }) => eq(studentProfile.userId, userRecord.id),
      with: {
        user: true,
      },
    });
    if (!studentRecord) return redirect("/onboarding/student");
    return <StudentProfile studentRecord={studentRecord} />;
  }

  if (userRecord.role === "mentor") {
    const mentorRecord = await db.query.mentorProfile.findFirst({
      where: (fields, { eq }) => eq(mentorProfile.userId, userRecord.id),
      with: {
        user: true,
      },
    });
    if (!mentorRecord) return redirect("/onboarding/mentor");
    if (mentorRecord.verifiedStatus === "pending") return redirect("/waitlist");
    if (mentorRecord.verifiedStatus === "rejected")
      return redirect("/rejected");
    return <MentorProfile mentorRecord={mentorRecord} />;
  }
}
