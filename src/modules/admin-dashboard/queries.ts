import { queryOptions } from "@tanstack/react-query";
import { unwrap } from "@/utils/action-result";
import {
  getAdminNavCounts,
  getAdminOverview,
} from "../../../server/actions/admin-dashboard/overview";

// Invalidate `adminDashboardKeys.all` after an admin decision (approving a
// mentor, scheduling a call): the overview and the sidebar badges hang off it.
export const adminDashboardKeys = {
  all: ["admin-dashboard"] as const,
  overview: () => [...adminDashboardKeys.all, "overview"] as const,
  navCounts: () => [...adminDashboardKeys.all, "nav-counts"] as const,
};

export const adminOverviewQueryOptions = () =>
  queryOptions({
    queryKey: adminDashboardKeys.overview(),
    queryFn: async () => unwrap(await getAdminOverview()),
  });

export const adminNavCountsQueryOptions = () =>
  queryOptions({
    queryKey: adminDashboardKeys.navCounts(),
    queryFn: async () => unwrap(await getAdminNavCounts()),
    staleTime: 60 * 1000,
    // The shell lives in the layout and never remounts, so poll for work
    // that arrives while the dashboard is open.
    refetchInterval: 60 * 1000,
  });
