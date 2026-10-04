import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { unwrap } from "@/utils/action-result";
import {
  getAdminNavCounts,
  getAdminOverview,
} from "../../../server/actions/admin-dashboard/overview";
import {
  getAdminMentorCounts,
  listAdminMentors,
  listAdminStudents,
  type AdminMentorFilter,
} from "../../../server/actions/admin-dashboard/people";

export type AdminMentorsParams = {
  status: AdminMentorFilter;
  q: string;
  page: number;
};
export type AdminStudentsParams = { q: string; page: number };

// Invalidate `adminDashboardKeys.all` after an admin decision (approving a
// mentor, scheduling a call): the overview and the sidebar badges hang off it.
export const adminDashboardKeys = {
  all: ["admin-dashboard"] as const,
  overview: () => [...adminDashboardKeys.all, "overview"] as const,
  navCounts: () => [...adminDashboardKeys.all, "nav-counts"] as const,
  mentors: (params: AdminMentorsParams) =>
    [...adminDashboardKeys.all, "mentors", "list", params] as const,
  mentorCounts: () =>
    [...adminDashboardKeys.all, "mentors", "counts"] as const,
  students: (params: AdminStudentsParams) =>
    [...adminDashboardKeys.all, "students", "list", params] as const,
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

// Tables keep showing the previous page while the next one loads.
export const adminMentorsQueryOptions = (params: AdminMentorsParams) =>
  queryOptions({
    queryKey: adminDashboardKeys.mentors(params),
    queryFn: async () => unwrap(await listAdminMentors(params)),
    placeholderData: keepPreviousData,
  });

export const adminMentorCountsQueryOptions = () =>
  queryOptions({
    queryKey: adminDashboardKeys.mentorCounts(),
    queryFn: async () => unwrap(await getAdminMentorCounts()),
  });

export const adminStudentsQueryOptions = (params: AdminStudentsParams) =>
  queryOptions({
    queryKey: adminDashboardKeys.students(params),
    queryFn: async () => unwrap(await listAdminStudents(params)),
    placeholderData: keepPreviousData,
  });
