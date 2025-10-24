"use client";

import * as React from "react";
import {

  Frame,
  Map,
  PieChart,
  School2Icon,
  SchoolIcon,
  UsersRoundIcon,
  VideoIcon,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Home, User, Users, Video, CreditCard, FileText } from "lucide-react";
import { IconReportAnalytics } from "@tabler/icons-react";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain : [
  {
    title: "Dashboard",
    url: "/admin",
    icon: Home,
    isActive: true,
    items: [
      {
        title: "Dashboard",
    url: "/admin/dashboard",
    icon: IconReportAnalytics,
      }
    ]
  },
  {
    title: "Mentors",
    url: "/admin/mentors",
    icon: Users,
    items: [
      {
        title: "All Mentors",
        url: "/admin/mentors",
        icon: User,
      },
      {
        title: "Mentor Applications",
        url: "/admin/mentor-applications",
        icon: FileText,
      },
    ],
  },
  {
    title: "Students",
    url: "/admin/students",
    icon: Users,
    items: [
      {
        title: "All Students",
        url: "/admin/students",
        icon: User,
      },
    ],
  },
  {
    title: "Video Calls",
    url: "/video-calls",
    icon: Video,
  },
  {
    title: "Payments",
    url: "/payments",
    icon: CreditCard,
  },
  {
    title:"schools",
    url:"/schools",
    icon: SchoolIcon,
    items: [
      {
        title: "All Schools",
        url: "/admin/schools",
        icon: School2Icon
      },
      {
        title: "Add School",
        url: "/admin/add-school",
        icon: SchoolIcon
      },
    ]
  },
  {
    title: "Sessions",
    url: "/admin/session-users",
    icon: VideoIcon
  }
],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
       <div className="flex gap-2">
         <UsersRoundIcon />
          <p className="font-bold truncate">NepaliPool</p>
       </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
