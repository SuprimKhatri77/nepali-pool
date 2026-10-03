import { asc, desc, eq } from "drizzle-orm";
import { db } from "../../../../../lib/db";
import { mentorPaymentDetails, mentorService } from "../../../../../lib/db/schema";
import { requireApprovedMentor } from "../../../../../server/lib/auth/guards";
import ManageServices from "@/components/mentor-services/ManageServices";

export const metadata = {
  title: "My Services | NepaliPool",
};

export default async function MentorServicesPage() {
  const { mentorRecord } = await requireApprovedMentor();

  const [services, paymentDetails] = await Promise.all([
    db
      .select()
      .from(mentorService)
      .where(eq(mentorService.mentorId, mentorRecord.userId))
      .orderBy(desc(mentorService.isActive), asc(mentorService.createdAt)),
    db.query.mentorPaymentDetails.findFirst({
      where: eq(mentorPaymentDetails.mentorId, mentorRecord.userId),
    }),
  ]);

  return (
    <ManageServices
      services={services}
      paymentInstructions={paymentDetails?.instructions ?? null}
      paymentQrUrl={paymentDetails?.qrUrl ?? null}
    />
  );
}
