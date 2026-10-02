import { desc, eq } from "drizzle-orm";
import { db } from "../../../lib/db";
import { chats, serviceBooking } from "../../../lib/db/schema";
import { requireStudent } from "../../../server/lib/auth/helpers/require-student";
import StudentBookings from "@/components/mentor-services/StudentBookings";

export const metadata = {
  title: "My Bookings | NepaliPool",
};

export default async function StudentBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ booked?: string }>;
}) {
  const { studentRecord } = await requireStudent();
  const { booked } = await searchParams;
  const studentId = studentRecord.userId;

  const [bookings, chatRows] = await Promise.all([
    db.query.serviceBooking.findMany({
      where: eq(serviceBooking.studentId, studentId),
      with: { mentorProfile: { with: { user: { columns: { name: true } } } } },
      orderBy: desc(serviceBooking.createdAt),
    }),
    db
      .select({ id: chats.id, mentorId: chats.mentorId })
      .from(chats)
      .where(eq(chats.studentId, studentId)),
  ]);

  return (
    <StudentBookings
      bookings={bookings.map(({ mentorProfile, ...booking }) => ({
        ...booking,
        mentorName: mentorProfile.user.name,
      }))}
      chatIdByMentor={Object.fromEntries(
        chatRows.map((row) => [row.mentorId, row.id]),
      )}
      // Only matches the student's own bookings, so a crafted URL shows nothing.
      justBookedRef={bookings.some((b) => b.referenceCode === booked) ? booked : undefined}
    />
  );
}
