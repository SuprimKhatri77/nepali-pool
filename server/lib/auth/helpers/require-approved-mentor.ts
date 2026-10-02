import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "../../../../lib/db";
import { mentorProfile } from "../../../../lib/db/schema";
import { requireUser } from "./requireUser";

// Page guard: only approved mentors get through, everyone else is redirected
// to where they belong.
export async function requireApprovedMentor() {
  const userRecord = await requireUser();
  if (userRecord.role === "admin") return redirect("/admin");
  if (userRecord.role !== "mentor") {
    return redirect(`/dashboard/${userRecord.role}`);
  }

  const mentorRecord = await db.query.mentorProfile.findFirst({
    where: eq(mentorProfile.userId, userRecord.id),
  });
  if (!mentorRecord) {
    return redirect(
      "/onboarding/mentor?message=Please+complete+the+onboarding+to+continue!",
    );
  }
  if (mentorRecord.verifiedStatus === "pending") return redirect("/waitlist");
  if (mentorRecord.verifiedStatus === "rejected") return redirect("/rejected");

  return { userRecord, mentorRecord };
}
