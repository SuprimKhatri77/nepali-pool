import StudentPage from "@/components/Student";
import { auth } from "../../../../../server/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "../../../../../lib/db";
import {
  chatSubscription,
  ChatSubscriptionSelectType,
  favorite,
  mentorProfile,
  preferredTime,
  studentProfile,
  user,
  videoCall,
} from "../../../../../lib/db/schema";
import { and, eq } from "drizzle-orm";
import { StudentProfileWithUser } from "../../../../../types/all-types";

export default async function Student() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return redirect("/login");
  }

  const [userRecord] = await db
    .select()
    .from(user)
    .where(eq(user.id, session.user.id));

  if (!userRecord.emailVerified) {
    return redirect(
      `/sign-up/verify-email?email=${encodeURIComponent(session.user.email)}`
    );
  }

  if (userRecord.role === "none") {
    return redirect(`/select-role`);
  }

  if (userRecord.role === "admin") {
    return redirect("/admin");
  }

  if (userRecord.role === "mentor") {
    const [mentorProfileRecord] = await db
      .select()
      .from(mentorProfile)
      .where(eq(mentorProfile.userId, userRecord.id));
    if (!mentorProfileRecord) {
      return redirect("/sign-up/onboarding/student");
    }
    return redirect("/dashboard/mentor");
  }

  if (userRecord.role === "student") {
    const [studentProfileRecord] = await db
      .select()
      .from(studentProfile)
      .where(eq(studentProfile.userId, userRecord.id));
    if (!studentProfileRecord) {
      return redirect("/sign-up/onboarding/student");
    }

    const mentorProfiles = await db.query.mentorProfile.findMany({
      where: (fields, { eq }) => eq(mentorProfile.verifiedStatus, "accepted"),
      with: {
        user: true,
      },
    });

    const macthingMentors = mentorProfiles.filter((prof) =>
      studentProfileRecord.favoriteDestination?.includes(prof.country!)
    );

    const studentRecordWithUser = (await db.query.studentProfile.findFirst({
      where: (fields, { eq }) => eq(studentProfile.userId, userRecord.id),
      with: {
        user: true,
        videoCall: {
          with: {
            preferredTime: true,
          },
        },
      },
    })) as StudentProfileWithUser | null;
    // console.log("Student with User: ", studentRecordWithUser);

    if (!studentRecordWithUser) {
      return redirect("/login");
    }

    const favoriteMentor = await db.query.favorite.findMany({
      where: (fields, { eq }) =>
        eq(favorite.studentId, studentRecordWithUser.userId),
      with: {
        mentor: {
          with: {
            user: true,
          },
        },
      },
    });

    if (!favoriteMentor) {
      return [];
    }

    const studentChatSubscriptions: ChatSubscriptionSelectType[] =
      await db.query.chatSubscription.findMany({
        where: (fields, { eq }) =>
          eq(chatSubscription.studentId, studentRecordWithUser.userId),
      });

    const videoCallRecord = await db.query.videoCall.findMany({
      where: (field, { eq }) => eq(videoCall.studentId, userRecord.id),
      with: {
        preferredTime: true,
      },
    });

    if (videoCallRecord.length === 0) {
      return [];
    }

    return (
      <StudentPage
        matchingMentors={macthingMentors}
        studentRecordWithUser={studentRecordWithUser}
        favoriteMentor={favoriteMentor}
        chatSubscriptions={studentChatSubscriptions}
      />
    );
  }

  return redirect(`/select-role`);
}
