import { and, count, desc, eq } from "drizzle-orm";
import { db } from "../../../../../lib/db";
import {
  chats,
  mentorEnquiry,
  mentorEnquiryStatusEnum,
  type MentorEnquiryStatus,
} from "../../../../../lib/db/schema";
import { requireApprovedMentor } from "../../../../../server/lib/auth/guards";
import MentorEnquiries, {
  type EnquiryFilter,
  type MentorEnquiryRow,
} from "@/components/mentor-services/MentorEnquiries";

export const metadata = {
  title: "Enquiries | NepaliPool",
};

const ENQUIRIES_LIMIT = 100;

function parseFilter(value: string | undefined): EnquiryFilter {
  if (value === "all") return "all";
  return mentorEnquiryStatusEnum.enumValues.includes(
    value as MentorEnquiryStatus,
  )
    ? (value as MentorEnquiryStatus)
    : "new";
}

export default async function MentorEnquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { userRecord, mentorRecord } = await requireApprovedMentor();
  const filter = parseFilter((await searchParams).status);
  const mentorId = mentorRecord.userId;

  const [enquiries, statusCounts, chatRows] = await Promise.all([
    db
      .select()
      .from(mentorEnquiry)
      .where(
        and(
          eq(mentorEnquiry.mentorId, mentorId),
          filter === "all" ? undefined : eq(mentorEnquiry.status, filter),
        ),
      )
      .orderBy(desc(mentorEnquiry.createdAt))
      .limit(ENQUIRIES_LIMIT),
    db
      .select({ status: mentorEnquiry.status, total: count() })
      .from(mentorEnquiry)
      .where(eq(mentorEnquiry.mentorId, mentorId))
      .groupBy(mentorEnquiry.status),
    db
      .select({ id: chats.id, studentId: chats.studentId })
      .from(chats)
      .where(eq(chats.mentorId, mentorId)),
  ]);

  // Contact details only leave the server once the mentor has accepted; hiding
  // them in the UI alone would still ship them in the page payload.
  const rows: MentorEnquiryRow[] = enquiries.map((enquiry) =>
    enquiry.status === "accepted"
      ? enquiry
      : { ...enquiry, email: null, whatsappNumber: null },
  );

  return (
    <MentorEnquiries
      mentorName={userRecord.name}
      filter={filter}
      counts={
        Object.fromEntries(
          statusCounts.map((row) => [row.status, row.total]),
        ) as Partial<Record<MentorEnquiryStatus, number>>
      }
      enquiries={rows}
      chatIdByStudent={Object.fromEntries(
        chatRows.map((row) => [row.studentId, row.id]),
      )}
      isTruncated={enquiries.length === ENQUIRIES_LIMIT}
    />
  );
}
