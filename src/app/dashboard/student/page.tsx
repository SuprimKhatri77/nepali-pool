import { StudentOverview } from "@/components/dashboard/student/student-overview";
import { requireStudent } from "../../../../server/lib/auth/guards";

export const metadata = {
  title: "Student dashboard | NepaliPool",
};

// Matching mentors load on the client (StudentOverview), page by page.
export default async function StudentDashboardPage() {
  const { userRecord, studentRecord } = await requireStudent();
  const firstName = userRecord.name.trim().split(/\s+/)[0] || "there";

  return (
    <StudentOverview
      firstName={firstName}
      destinations={studentRecord.favoriteDestination ?? []}
    />
  );
}
