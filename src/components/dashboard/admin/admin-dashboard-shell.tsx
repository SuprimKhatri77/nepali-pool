"use client";

import { useQuery } from "@tanstack/react-query";
import {
  CalendarClock,
  CirclePlus,
  FileCheck2,
  GraduationCap,
  LayoutDashboard,
  School,
  Users,
  Video,
} from "lucide-react";
import {
  DashboardShell,
  type DashboardNavGroup,
  type DashboardUser,
} from "@/components/dashboard/dashboard-shell";
import { adminNavCountsQueryOptions } from "@/modules/admin-dashboard/queries";
import {
  ADMIN_DASHBOARD_HREF,
  ADMIN_MENTOR_APPLICATIONS_HREF,
  ADMIN_VIDEO_CALLS_HREF,
} from "./routes";

export function AdminDashboardShell({
  user,
  defaultOpen,
  children,
}: {
  user: DashboardUser;
  defaultOpen: boolean;
  children: React.ReactNode;
}) {
  // Badges just stay hidden if this fails; the pages show their own errors.
  const { data: counts } = useQuery(adminNavCountsQueryOptions());

  const groups: DashboardNavGroup[] = [
    {
      label: "Admin",
      items: [
        {
          title: "Overview",
          href: ADMIN_DASHBOARD_HREF,
          icon: LayoutDashboard,
          exact: true,
        },
      ],
    },
    {
      label: "People",
      items: [
        { title: "Mentors", href: "/admin/mentors", icon: Users },
        {
          title: "Mentor applications",
          href: ADMIN_MENTOR_APPLICATIONS_HREF,
          icon: FileCheck2,
          badge: counts?.pendingApplications,
        },
        { title: "Students", href: "/admin/students", icon: GraduationCap },
      ],
    },
    {
      label: "Calls",
      items: [
        {
          title: "Video call requests",
          href: ADMIN_VIDEO_CALLS_HREF,
          icon: Video,
          badge: counts?.pendingVideoCalls,
        },
        {
          title: "Meeting sessions",
          href: "/admin/session-users",
          icon: CalendarClock,
        },
      ],
    },
    {
      label: "Schools",
      items: [
        { title: "All schools", href: "/admin/schools", icon: School },
        { title: "Add a school", href: "/add-school", icon: CirclePlus },
      ],
    },
  ];

  return (
    <DashboardShell
      title="Admin"
      homeHref={ADMIN_DASHBOARD_HREF}
      groups={groups}
      user={user}
      defaultOpen={defaultOpen}
    >
      {children}
    </DashboardShell>
  );
}
