import { db } from "../../../../lib/db";
import {
  chatSubscription,
  mentorEnquiry,
  serviceBooking,
  videoCall,
} from "../../../../lib/db/schema";
import { and, count, eq, sql } from "drizzle-orm";
import MentorPage from "@/components/Mentor";
import { requireApprovedMentor } from "../../../../server/lib/auth/guards";
import { getChatIncreaseCount } from "../../../../server/helper/getChatIncreaseCount";

export const metadata = {
  title: "Mentor | Nepai Pool",
};

export default async function Mentor() {
  const { mentorRecord } = await requireApprovedMentor();
  const mentorId = mentorRecord.userId;

  const [
    [chatCount],
    [scheduledVideoCallCount],
    [totalUniqueStudents],
    chatIncrease,
    [newEnquiryCount],
    [pendingBookingCount],
  ] = await Promise.all([
    db
      .select({ count: count() })
      .from(chatSubscription)
      .where(eq(chatSubscription.mentorId, mentorId)),
    db
      .select({ count: count() })
      .from(videoCall)
      .where(
        and(eq(videoCall.mentorId, mentorId), eq(videoCall.status, "scheduled"))
      ),
    db
      .select({ count: sql<number>`COUNT(DISTINCT student_id)` })
      .from(
        sql`
      (
        SELECT student_id FROM chat_subscription WHERE mentor_id = ${mentorId}
        UNION
        SELECT student_id FROM video_call WHERE mentor_id = ${mentorId}
      ) AS combined
    `
      ),
    getChatIncreaseCount(mentorId),
    db
      .select({ count: count() })
      .from(mentorEnquiry)
      .where(
        and(eq(mentorEnquiry.mentorId, mentorId), eq(mentorEnquiry.status, "new"))
      ),
    db
      .select({ count: count() })
      .from(serviceBooking)
      .where(
        and(
          eq(serviceBooking.mentorId, mentorId),
          eq(serviceBooking.status, "pending")
        )
      ),
  ]);

  return (
    <MentorPage
      chatCount={chatCount.count}
      scheduledVideoCallCount={scheduledVideoCallCount.count}
      totalUniqueStudents={totalUniqueStudents.count}
      chatIncreaseCount={chatIncrease ?? 0}
      pendingBookingCount={pendingBookingCount.count}
      newEnquiryCount={newEnquiryCount.count}
    />
  );
}
