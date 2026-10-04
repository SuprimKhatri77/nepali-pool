import "server-only";

import { and, count, eq } from "drizzle-orm";
import { db } from "../../../lib/db";
import { mentorEnquiry, serviceBooking } from "../../../lib/db/schema";

export type MentorAttentionCounts = {
  // Bookings waiting for the mentor to verify the payment.
  pendingBookings: number;
  // Free questions the mentor hasn't answered yet.
  newEnquiries: number;
};

export async function getMentorAttentionCounts(
  mentorId: string,
): Promise<MentorAttentionCounts> {
  const [[bookings], [enquiries]] = await Promise.all([
    db
      .select({ count: count() })
      .from(serviceBooking)
      .where(
        and(
          eq(serviceBooking.mentorId, mentorId),
          eq(serviceBooking.status, "pending"),
        ),
      ),
    db
      .select({ count: count() })
      .from(mentorEnquiry)
      .where(
        and(
          eq(mentorEnquiry.mentorId, mentorId),
          eq(mentorEnquiry.status, "new"),
        ),
      ),
  ]);
  return { pendingBookings: bookings.count, newEnquiries: enquiries.count };
}
