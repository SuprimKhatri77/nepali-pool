"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Briefcase,
  ClipboardCheck,
  Eye,
  LayoutDashboard,
  MessageCircleQuestion,
  MessagesSquare,
  School,
  UserRound,
  Video,
} from "lucide-react";
import {
  DashboardShell,
  type DashboardNavGroup,
  type DashboardUser,
} from "@/components/dashboard/dashboard-shell";
import { mentorNavCountsQueryOptions } from "@/modules/mentor-dashboard/queries";

export const MENTOR_DASHBOARD_HREF = "/dashboard/mentor";

export function MentorDashboardShell({
  user,
  mentorId,
  defaultOpen,
  children,
}: {
  user: DashboardUser;
  mentorId: string;
  defaultOpen: boolean;
  children: React.ReactNode;
}) {
  // Badges just stay hidden if this fails; the pages show their own errors.
  const { data: counts } = useQuery(mentorNavCountsQueryOptions());

  const groups: DashboardNavGroup[] = [
    {
      label: "Workspace",
      items: [
        {
          title: "Overview",
          href: MENTOR_DASHBOARD_HREF,
          icon: LayoutDashboard,
          exact: true,
        },
        {
          title: "Services",
          href: `${MENTOR_DASHBOARD_HREF}/services`,
          icon: Briefcase,
        },
        {
          title: "Bookings",
          href: `${MENTOR_DASHBOARD_HREF}/bookings`,
          icon: ClipboardCheck,
          badge: counts?.pendingBookings,
        },
        {
          title: "Enquiries",
          href: `${MENTOR_DASHBOARD_HREF}/enquiries`,
          icon: MessageCircleQuestion,
          badge: counts?.newEnquiries,
        },
      ],
    },
    {
      label: "Students",
      items: [
        { title: "Chats", href: "/chats", icon: MessagesSquare },
        { title: "Video calls", href: "/video-call", icon: Video },
      ],
    },
    {
      label: "Account",
      items: [
        { title: "Profile", href: "/profile", icon: UserRound },
        { title: "Public profile", href: `/mentors/${mentorId}`, icon: Eye },
        { title: "Add a school", href: "/add-school", icon: School },
      ],
    },
  ];

  return (
    <DashboardShell
      title="Mentor dashboard"
      homeHref={MENTOR_DASHBOARD_HREF}
      groups={groups}
      user={user}
      defaultOpen={defaultOpen}
    >
      {children}
    </DashboardShell>
  );
}
