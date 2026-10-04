import "server-only";

import { and, eq } from "drizzle-orm";
import { db } from "../../../lib/db";
import { mentorEnquiry, serviceBooking } from "../../../lib/db/schema";
import { isReferenceCode } from "../mentor-services/reference-code";

// The "just booked / just enquired" banners take the reference from the URL.
// Only echo it back when it's one of this student's own records, so a
// crafted link can't put arbitrary text (or someone else's code) on the page.

export async function ownBookingReference(
  studentId: string,
  code: unknown,
): Promise<string | null> {
  if (!isReferenceCode(code)) return null;
  const [row] = await db
    .select({ referenceCode: serviceBooking.referenceCode })
    .from(serviceBooking)
    .where(
      and(
        eq(serviceBooking.referenceCode, code),
        eq(serviceBooking.studentId, studentId),
      ),
    )
    .limit(1);
  return row?.referenceCode ?? null;
}

export async function ownEnquiryReference(
  studentId: string,
  code: unknown,
): Promise<string | null> {
  if (!isReferenceCode(code)) return null;
  const [row] = await db
    .select({ referenceCode: mentorEnquiry.referenceCode })
    .from(mentorEnquiry)
    .where(
      and(
        eq(mentorEnquiry.referenceCode, code),
        eq(mentorEnquiry.studentId, studentId),
      ),
    )
    .limit(1);
  return row?.referenceCode ?? null;
}
