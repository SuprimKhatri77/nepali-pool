import { and, count, desc, eq } from "drizzle-orm";
import { db } from "../../../../../lib/db";
import {
  chats,
  serviceBooking,
  serviceBookingStatusEnum,
  type ServiceBookingStatus,
} from "../../../../../lib/db/schema";
import { requireApprovedMentor } from "../../../../../server/lib/auth/helpers/require-approved-mentor";
import MentorBookings, {
  type BookingFilter,
} from "@/components/mentor-services/MentorBookings";

export const metadata = {
  title: "Service Bookings | NepaliPool",
};

const BOOKINGS_LIMIT = 100;

function parseFilter(value: string | undefined): BookingFilter {
  if (value === "all") return "all";
  return serviceBookingStatusEnum.enumValues.includes(value as ServiceBookingStatus)
    ? (value as ServiceBookingStatus)
    : "pending";
}

export default async function MentorBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { userRecord, mentorRecord } = await requireApprovedMentor();
  const filter = parseFilter((await searchParams).status);
  const mentorId = mentorRecord.userId;

  const [bookings, statusCounts, chatRows] = await Promise.all([
    db
      .select()
      .from(serviceBooking)
      .where(
        and(
          eq(serviceBooking.mentorId, mentorId),
          filter === "all" ? undefined : eq(serviceBooking.status, filter),
        ),
      )
      .orderBy(desc(serviceBooking.createdAt))
      .limit(BOOKINGS_LIMIT),
    db
      .select({ status: serviceBooking.status, total: count() })
      .from(serviceBooking)
      .where(eq(serviceBooking.mentorId, mentorId))
      .groupBy(serviceBooking.status),
    db
      .select({ id: chats.id, studentId: chats.studentId })
      .from(chats)
      .where(eq(chats.mentorId, mentorId)),
  ]);

  const counts = Object.fromEntries(
    statusCounts.map((row) => [row.status, row.total]),
  ) as Partial<Record<ServiceBookingStatus, number>>;
  const chatIdByStudent = Object.fromEntries(
    chatRows.map((row) => [row.studentId, row.id]),
  );

  return (
    <MentorBookings
      mentorName={userRecord.name}
      filter={filter}
      counts={counts}
      bookings={bookings}
      chatIdByStudent={chatIdByStudent}
      isTruncated={bookings.length === BOOKINGS_LIMIT}
    />
  );
}
