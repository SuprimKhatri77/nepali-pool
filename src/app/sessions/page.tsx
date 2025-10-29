import { headers } from "next/headers";
import { auth } from "../../../server/lib/auth/auth";
import { db } from "../../../lib/db";
import { studentProfile, user } from "../../../lib/db/schema";
import SessionLandingPage from "@/components/sessions/SessionLanding";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    const [userRecord] = await db
      .select()
      .from(user)
      .where(eq(user.id, session.user.id));
    if (userRecord.role === "none" || !userRecord.role)
      redirect("/select-role");

    if (userRecord.role === "student") {
      const studentProfileRecord = await db.query.studentProfile.findFirst({
        where: (fields, { eq }) => eq(studentProfile.userId, session.user.id),
        with: {
          user: true,
        },
      });
      if (studentProfileRecord) {
        const sessionRecord = await db.query.meetingSession.findFirst({
          where: (fields, { eq }) =>
            eq(fields.studentId, studentProfileRecord.userId),
        });
        return (
          <SessionLandingPage
            studentProfileRecord={studentProfileRecord}
            sessionRecord={sessionRecord ?? null}
            hasSession={true}
            hasStudentOnboardingData={true}
            role="student"
          />
        );
      } else {
        const sessionRecord = await db.query.meetingSession.findFirst({
          where: (fields, { eq }) => eq(fields.studentId, userRecord.id),
        });
        return (
          <SessionLandingPage
            hasSession={true}
            role={userRecord.role}
            hasStudentOnboardingData={false}
            sessionRecord={sessionRecord ?? null}
          />
        );
      }
    }

    return <SessionLandingPage hasSession={true} role={userRecord.role} />;
  }
  return <SessionLandingPage hasSession={false} />;
}
