import { redirect } from "next/navigation";
import { auth } from "../../../server/lib/auth/auth";
import { db } from "../../../lib/db";
import { mentorProfile, user } from "../../../lib/db/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import AddSchool from "@/components/AddSchool";

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) redirect("/login");

  const [userRecord] = await db
    .select()
    .from(user)
    .where(eq(user.id, session.user.id));
  if (!userRecord) redirect("/login");
  if (userRecord.role !== "mentor" && userRecord.role !== "admin")
    redirect("/");

  if (userRecord.role === "mentor") {
    const [mentorRecord] = await db
      .select()
      .from(mentorProfile)
      .where(eq(mentorProfile.userId, userRecord.id));
    if (!mentorRecord) redirect("/onboarding/mentor");
    if (mentorRecord.verifiedStatus !== "accepted")
      redirect(
        mentorRecord.verifiedStatus === "pending" ? "/waitlist" : "/rejected"
      );
    return <AddSchool currentUserId={mentorRecord.userId} />;
  }
  return <AddSchool currentUserId={userRecord.id} />;
}
