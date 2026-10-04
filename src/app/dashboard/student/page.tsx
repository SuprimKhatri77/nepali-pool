import StudentPage from "@/components/Student";
import { redirect } from "next/navigation";
import { requireStudent } from "../../../../server/lib/auth/guards";
import { db } from "../../../../lib/db";
import { favorite, studentProfile } from "../../../../lib/db/schema";
import {
  publicMentorColumns,
  publicMentorWith,
} from "../../../../server/lib/mentors/public-mentor";
import { StudentProfileWithUser } from "../../../../types/all-types";

export default async function Student() {
  const { userRecord, studentRecord: studentProfileRecord } =
    await requireStudent();

  // Accepted mentors in the student's destination countries, public fields
  // only.
  const destinations = studentProfileRecord.favoriteDestination ?? [];
  const macthingMentors =
    destinations.length === 0
      ? []
      : await db.query.mentorProfile.findMany({
          columns: publicMentorColumns,
          with: publicMentorWith,
          where: (fields, { and, eq, inArray }) =>
            and(
              eq(fields.verifiedStatus, "accepted"),
              inArray(fields.country, destinations),
            ),
        });

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
