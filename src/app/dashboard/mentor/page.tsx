import { MentorOverview } from "@/components/dashboard/mentor/mentor-overview";
import { requireApprovedMentor } from "../../../../server/lib/auth/guards";

export const metadata = {
  title: "Mentor dashboard | NepaliPool",
};

// The numbers load on the client (MentorOverview), so this page renders
// without waiting on the database.
export default async function MentorDashboardPage() {
  const { userRecord } = await requireApprovedMentor();
  const firstName = userRecord.name.trim().split(/\s+/)[0] || "there";

  return <MentorOverview firstName={firstName} />;
}
