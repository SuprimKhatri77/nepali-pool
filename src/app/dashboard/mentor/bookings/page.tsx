import {
  serviceBookingStatusEnum,
  type ServiceBookingStatus,
} from "../../../../../lib/db/schema";
import { requireApprovedMentor } from "../../../../../server/lib/auth/guards";
import type { BookingFilter } from "../../../../../server/actions/mentor-dashboard/bookings";
import MentorBookings from "@/components/mentor-services/MentorBookings";

export const metadata = {
  title: "Service Bookings | NepaliPool",
};

function parseFilter(value: string | undefined): BookingFilter {
  if (value === "all") return "all";
  return serviceBookingStatusEnum.enumValues.includes(value as ServiceBookingStatus)
    ? (value as ServiceBookingStatus)
    : "pending";
}

// The bookings load on the client (MentorBookings), page by page.
export default async function MentorBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { userRecord } = await requireApprovedMentor();
  const filter = parseFilter((await searchParams).status);

  return <MentorBookings mentorName={userRecord.name} filter={filter} />;
}
