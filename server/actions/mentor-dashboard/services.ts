"use server";

import { asc, desc, eq } from "drizzle-orm";
import { db } from "../../../lib/db";
import {
  mentorPaymentDetails,
  mentorService,
  type MentorServiceSelectType,
} from "../../../lib/db/schema";
import type { ActionResult } from "../../../src/utils/action-result";
import { getCurrentMentor } from "../../lib/auth/guards";

export type MentorServicesData = {
  services: MentorServiceSelectType[];
  paymentInstructions: string | null;
  paymentQrUrl: string | null;
};

// The mentor's own services (active first) and payment details.
export async function getMentorServices(): Promise<
  ActionResult<MentorServicesData>
> {
  const current = await getCurrentMentor();
  if (!current.success) return current;
  const mentorId = current.mentorRecord.userId;

  const [services, paymentDetails] = await Promise.all([
    db
      .select()
      .from(mentorService)
      .where(eq(mentorService.mentorId, mentorId))
      .orderBy(desc(mentorService.isActive), asc(mentorService.createdAt)),
    db.query.mentorPaymentDetails.findFirst({
      columns: { instructions: true, qrUrl: true },
      where: eq(mentorPaymentDetails.mentorId, mentorId),
    }),
  ]);

  return {
    success: true,
    data: {
      services,
      paymentInstructions: paymentDetails?.instructions ?? null,
      paymentQrUrl: paymentDetails?.qrUrl ?? null,
    },
  };
}
