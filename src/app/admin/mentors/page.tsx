import { requireAdmin } from "../../../../server/lib/auth/guards";
import { db } from "../../../../lib/db";
import { MentorProfileWithUser } from "../../../../types/all-types";
import AdminMentors from "@/components/admin/mentors/AdminMentor";

export default async function Page() {
  await requireAdmin();

  const mentors: MentorProfileWithUser[] =
    await db.query.mentorProfile.findMany({
      with: {
        user: true,
      },
    });

  return <AdminMentors mentors={mentors} />;
}
