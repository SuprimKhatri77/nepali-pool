import { headers } from "next/headers";
import { auth } from "../../../../../server/lib/auth/auth";
import { notFound, redirect } from "next/navigation";
import { db } from "../../../../../lib/db";
import {
  chatSubscription,
  mentorProfile,
  studentProfile,
  videoCall,
} from "../../../../../lib/db/schema";
import { user } from "../../../../../lib/db/schema";
import { and, count, eq, gte, lt, sql } from "drizzle-orm";
import MentorPage from "@/components/Mentor";
import { requireUser } from "../../../../../server/lib/auth/helpers/requireUser";
import { getStudentProfile } from "../../../../../server/lib/auth/helpers/getStudentProfile";
import { startOfWeek, subWeeks } from "date-fns";
import { getChatIncreaseCount } from "../../../../../server/helper/getChatIncreaseCount";

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

    const [chatCount] = await db
      .select({ count: count() })
      .from(chatSubscription)
      .where(eq(chatSubscription.mentorId, mentorProfileRecord.userId));
    const [scheduledVideoCallCount] = await db
      .select({ count: count() })
      .from(videoCall)
      .where(
        and(
          eq(videoCall.mentorId, mentorProfileRecord.userId),
          eq(videoCall.status, "scheduled")
        )
      );
    // console.log("chat count: ", chatCount);
    // console.log("chat count type: ", typeof chatCount.count);
    // console.log("scheduled video call count: ", scheduledVideoCallCount);
    // console.log("video call count: ", typeof scheduledVideoCallCount.count);

    const [totalUniqueStudents] = await db
      .select({
        count: sql<number>`
      COUNT(DISTINCT student_id)
    `,
      })
      .from(
        sql`
      (
        SELECT student_id FROM chat_subscription WHERE mentor_id = ${mentorProfileRecord.userId}
        UNION
        SELECT student_id FROM video_call WHERE mentor_id = ${mentorProfileRecord.userId}
      ) AS combined
    `
      );

    // console.log(totalUniqueStudents);

    const chatIncrease = await getChatIncreaseCount(mentorProfileRecord.userId);
    // console.log("increase: ", chatIncrease);

    return (
      <MentorPage
        chatCount={chatCount.count}
        scheduledVideoCallCount={scheduledVideoCallCount.count}
        totalUniqueStudents={totalUniqueStudents.count}
        chatIncreaseCount={chatIncrease ?? 0}
      />
    );
  }

  return notFound();
}
