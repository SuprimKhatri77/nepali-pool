import StudentPage from "@/components/Student";
import { requireUser } from "../../../../server/lib/auth/helpers/requireUser";
import { redirect } from "next/navigation";
import { getMentorProfile } from "../../../../server/lib/auth/helpers/getMentorProfile";
import { db } from "../../../../lib/db";
import {
  chatSubscription,
  ChatSubscriptionSelectType,
  favorite,
  mentorProfile,
  studentProfile,
} from "../../../../lib/db/schema";
import { eq } from "drizzle-orm";
import { StudentProfileWithUser } from "../../../../types/all-types";
import NotFound from "@/app/not-found";

export default async function Student() {
  const userRecord = await requireUser();

  if (userRecord.role === "admin") {
    return redirect("/admin");
  }

  if (userRecord.role === "mentor") {
    await getMentorProfile(userRecord.id);
  }

  if (userRecord.role === "student") {
    const [studentProfileRecord] = await db
      .select()
      .from(studentProfile)
      .where(eq(studentProfile.userId, userRecord.id));
    if (!studentProfileRecord) {
      return redirect("/onboarding/student");
    }

    const mentorProfiles = await db.query.mentorProfile.findMany({
      where: (fields, { eq }) => eq(mentorProfile.verifiedStatus, "accepted"),
      with: {
        user: true,
        chats: true,
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
      return redirect("/login?toast=Please+log+in+to+continue");
    }

    const favoriteMentor =
      (await db.query.favorite.findMany({
        where: (fields, { eq }) =>
          eq(favorite.studentId, studentRecordWithUser.userId),
        with: {
          mentor: {
            with: {
              user: true,
            },
          },
        },
      })) || [];

    const studentChatSubscriptions: ChatSubscriptionSelectType[] =
      await db.query.chatSubscription.findMany({
        where: (fields, { eq }) =>
          eq(chatSubscription.studentId, studentRecordWithUser.userId),
      });

    return (
      <StudentPage
        matchingMentors={macthingMentors}
        studentRecordWithUser={studentRecordWithUser}
        favoriteMentor={favoriteMentor}
        chatSubscriptions={studentChatSubscriptions}
      />
    );
  }

  return <NotFound />;
}
