import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
import { unwrap } from "@/utils/action-result";
import { getMentorDashboardOverview } from "../../../server/actions/mentor-dashboard/get-mentor-dashboard-overview";
import { getMentorNavCounts } from "../../../server/actions/mentor-dashboard/get-mentor-nav-counts";
import {
  getMentorBookingCounts,
  listMentorBookings,
  type BookingFilter,
} from "../../../server/actions/mentor-dashboard/bookings";
import {
  getMentorEnquiryCounts,
  listMentorEnquiries,
  type EnquiryFilter,
} from "../../../server/actions/mentor-dashboard/enquiries";
import { getMentorServices } from "../../../server/actions/mentor-dashboard/services";

// Invalidate `mentorDashboardKeys.all` after anything that changes a
// booking, enquiry, service or payment detail: the lists, filter counts,
// overview and sidebar badges all hang off it.
export const mentorDashboardKeys = {
  all: ["mentor-dashboard"] as const,
  overview: () => [...mentorDashboardKeys.all, "overview"] as const,
  navCounts: () => [...mentorDashboardKeys.all, "nav-counts"] as const,
  services: () => [...mentorDashboardKeys.all, "services"] as const,
  bookings: (status: BookingFilter) =>
    [...mentorDashboardKeys.all, "bookings", "list", status] as const,
  bookingCounts: () =>
    [...mentorDashboardKeys.all, "bookings", "counts"] as const,
  enquiries: (status: EnquiryFilter) =>
    [...mentorDashboardKeys.all, "enquiries", "list", status] as const,
  enquiryCounts: () =>
    [...mentorDashboardKeys.all, "enquiries", "counts"] as const,
};

export const mentorOverviewQueryOptions = () =>
  queryOptions({
    queryKey: mentorDashboardKeys.overview(),
    queryFn: async () => unwrap(await getMentorDashboardOverview()),
  });

export const mentorNavCountsQueryOptions = () =>
  queryOptions({
    queryKey: mentorDashboardKeys.navCounts(),
    queryFn: async () => unwrap(await getMentorNavCounts()),
    staleTime: 60 * 1000,
  });

export const mentorServicesQueryOptions = () =>
  queryOptions({
    queryKey: mentorDashboardKeys.services(),
    queryFn: async () => unwrap(await getMentorServices()),
  });

export const mentorBookingsInfiniteOptions = (status: BookingFilter) =>
  infiniteQueryOptions({
    queryKey: mentorDashboardKeys.bookings(status),
    queryFn: async ({ pageParam }) =>
      unwrap(await listMentorBookings({ status, cursor: pageParam })),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

export const mentorBookingCountsQueryOptions = () =>
  queryOptions({
    queryKey: mentorDashboardKeys.bookingCounts(),
    queryFn: async () => unwrap(await getMentorBookingCounts()),
  });

export const mentorEnquiriesInfiniteOptions = (status: EnquiryFilter) =>
  infiniteQueryOptions({
    queryKey: mentorDashboardKeys.enquiries(status),
    queryFn: async ({ pageParam }) =>
      unwrap(await listMentorEnquiries({ status, cursor: pageParam })),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

export const mentorEnquiryCountsQueryOptions = () =>
  queryOptions({
    queryKey: mentorDashboardKeys.enquiryCounts(),
    queryFn: async () => unwrap(await getMentorEnquiryCounts()),
  });
