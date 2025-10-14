import { headers } from "next/headers";
import { auth } from "../../../../../server/lib/auth/auth";
import { notFound, redirect } from "next/navigation";
import { db } from "../../../../../lib/db";
import { mentorProfile, studentProfile } from "../../../../../lib/db/schema";
import { user } from "../../../../../lib/db/schema";
import { eq } from "drizzle-orm";
import MentorPage from "@/components/Mentor";
import { requireUser } from "../../../../../server/lib/auth/helpers/requireUser";
import { getStudentProfile } from "../../../../../server/lib/auth/helpers/getStudentProfile";

export const metadata = {
  title: "Mentor | Nepai Pool",
};

export default async function Mentor() {
  const userRecord = await requireUser();

  if (userRecord.role === "admin") {
    return redirect("/admin");
  }
  if (userRecord.role === "student") {
    await getStudentProfile(userRecord.id);
  }

  if (userRecord.role === "mentor") {
    const [mentorProfileRecord] = await db
      .select()
      .from(mentorProfile)
      .where(eq(mentorProfile.userId, userRecord.id));
    if (!mentorProfileRecord) {
      return redirect("/onboarding/mentor");
    }
    if (mentorProfileRecord.verifiedStatus === "pending") {
      return redirect("/waitlist");
    }
    if (mentorProfileRecord.verifiedStatus === "rejected") {
      return redirect("/rejected");
    }
    return <MentorPage />;
  }

  return notFound();
}
