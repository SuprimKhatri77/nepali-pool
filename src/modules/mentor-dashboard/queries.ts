import { queryOptions } from "@tanstack/react-query";
import { unwrap } from "@/utils/action-result";
import { getMentorDashboardOverview } from "../../../server/actions/mentor-dashboard/get-mentor-dashboard-overview";
import { getMentorNavCounts } from "../../../server/actions/mentor-dashboard/get-mentor-nav-counts";

// Invalidate `mentorDashboardKeys.all` after anything that changes a
// booking, enquiry, chat or call so the overview and sidebar badges update.
export const mentorDashboardKeys = {
  all: ["mentor-dashboard"] as const,
  overview: () => [...mentorDashboardKeys.all, "overview"] as const,
  navCounts: () => [...mentorDashboardKeys.all, "nav-counts"] as const,
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
