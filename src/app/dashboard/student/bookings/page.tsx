import { StudentBookings } from "@/components/dashboard/student/student-bookings";
import { requireStudent } from "../../../../../server/lib/auth/guards";
import { ownBookingReference } from "../../../../../server/lib/student-dashboard/own-reference";

export const metadata = {
  title: "My bookings | NepaliPool",
};

export default async function StudentBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ booked?: string | string[] }>;
}) {
  const { studentRecord } = await requireStudent();
  const { booked } = await searchParams;

  return (
    <StudentBookings
      justBooked={await ownBookingReference(studentRecord.userId, booked)}
    />
  );
}
