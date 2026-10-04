"use client";

import {
  ClipboardList,
  Heart,
  LayoutDashboard,
  MessagesSquare,
  Search,
  UserRound,
  Video,
} from "lucide-react";
import {
  DashboardShell,
  type DashboardNavGroup,
  type DashboardUser,
} from "@/components/dashboard/dashboard-shell";

export const STUDENT_DASHBOARD_HREF = "/dashboard/student";

const groups: DashboardNavGroup[] = [
  {
    label: "Dashboard",
    items: [
      {
        title: "Overview",
        href: STUDENT_DASHBOARD_HREF,
        icon: LayoutDashboard,
        exact: true,
      },
      {
        title: "Favorites",
        href: `${STUDENT_DASHBOARD_HREF}/favorites`,
        icon: Heart,
      },
      { title: "My bookings", href: "/bookings", icon: ClipboardList },
    ],
  },
  {
    label: "Mentors",
    items: [
      { title: "Find mentors", href: "/mentors", icon: Search },
      { title: "Chats", href: "/chats", icon: MessagesSquare },
      { title: "Video calls", href: "/video-call", icon: Video },
    ],
  },
  {
    label: "Account",
    items: [{ title: "Profile", href: "/profile", icon: UserRound }],
  },
];

export function StudentDashboardShell({
  user,
  defaultOpen,
  children,
}: {
  user: DashboardUser;
  defaultOpen: boolean;
  children: React.ReactNode;
}) {
  return (
    <DashboardShell
      title="Student dashboard"
      homeHref={STUDENT_DASHBOARD_HREF}
      groups={groups}
      user={user}
      defaultOpen={defaultOpen}
    >
      {children}
    </DashboardShell>
  );
}
