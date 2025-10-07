"use client";

import * as React from "react";
import {
  HomeIcon,
  LogOutIcon,
  MessageCircleIcon,
  SettingsIcon,
  UserCircleIcon,
  UserIcon,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function MentorSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="text-foreground text-xl flex gap-3">
          <UserCircleIcon className="h-6 w-6 flex-shrink-0" />
          <span className="truncate">
            {props.collapsible ? "" : "Roshan Pokharel"}
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton className="hover:bg-gray-200 hover:text-black transition-colors duration-200">
                  <HomeIcon className="mr-2 h-4 w-4" />
                  Home
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className="hover:bg-gray-200 hover:text-black transition-colors duration-200">
                  <MessageCircleIcon className="mr-2 h-4 w-4" />
                  <Link href={"/mentor/chat"}>Messages</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className="hover:bg-gray-200 hover:text-black transition-colors duration-200">
                  <UserIcon className="mr-2 h-4 w-4" />
                  <Link href={"/mentor/profile"}>Profile</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className="hover:bg-gray-200 hover:text-black transition-colors duration-200">
                  <SettingsIcon className="mr-2 h-4 w-4" />
                  Settings
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Button>
          Logout <LogOutIcon />
        </Button>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
