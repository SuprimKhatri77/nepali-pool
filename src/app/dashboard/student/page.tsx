import StudentPage from "@/components/Student";
import { redirect } from "next/navigation";
import { requireStudent } from "../../../../server/lib/auth/guards";
import { db } from "../../../../lib/db";
import { favorite, mentorProfile, studentProfile } from "../../../../lib/db/schema";
import { StudentProfileWithUser } from "../../../../types/all-types";

export default async function Student() {
  const { userRecord, studentRecord: studentProfileRecord } =
    await requireStudent();

  const mentorProfiles = await db.query.mentorProfile.findMany({
    where: (fields, { eq }) => eq(mentorProfile.verifiedStatus, "accepted"),
    with: {
      user: true,
      chats: true,
    },
  });

  const macthingMentors = mentorProfiles.filter((prof) =>
    studentProfileRecord.favoriteDestination?.includes(prof.country!),
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
    return redirect("/login?message=Please+login+to+continue");
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

  // const studentChatSubscriptions: ChatSubscriptionSelectType[] =
  //   await db.query.chatSubscription.findMany({
  //     where: (fields, { eq }) =>
  //       eq(chatSubscription.studentId, studentRecordWithUser.userId),
  //   });

  return (
    <StudentPage
      matchingMentors={macthingMentors}
      studentRecordWithUser={studentRecordWithUser}
      favoriteMentor={favoriteMentor}
    />
  );
}
