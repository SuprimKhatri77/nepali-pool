"use client";

import * as React from "react";
import { GalleryVerticalEnd } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import { getUserChats } from "../../server/helper/getUserChats";
import {
  ChatsSelectType,
  MentorProfileSelectType,
  StudentProfileSelectType,
  UserSelectType,
} from "../../lib/db/schema";
import Link from "next/link";
import Image from "next/image";
import { NavUser } from "./ui/nav-user";
import { Skeleton } from "./ui/skeleton";
import { toast } from "sonner";

type Props = {
  role: "student" | "mentor";
  currentUser: UserSelectType;
};

type ChatWithUser = ChatsSelectType & {
  mentorProfile: MentorProfileSelectType & {
    user: UserSelectType;
  };
  studentProfile: StudentProfileSelectType & {
    user: UserSelectType;
  };
};

const Chats = ({ role, currentUser }: Props) => {
  const [chats, setChats] = useState<ChatWithUser[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    async function fetchChats() {
      setLoading(true);
      try {
        const result = await getUserChats();
        if (result.success) {
          setChats(result.chatsRecords);
        }
        if (!result.success && result.message) {
          setChats(result.chatsRecords);
          toast.error(result.message);
        }
      } catch (error) {
        console.error("Error fetching chats: ", error);
      } finally {
        setLoading(false);
      }
    }
    fetchChats();
  }, []);

  return (
    <Sidebar variant="inset">
      <SidebarHeader className="flex flex-row items-center justify-between">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-bold sm:text-lg">NepaliPool</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu className="gap-2">
            {loading ? (
              <div className="flex flex-col gap-4 px-2">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            ) : role === "student" ? (
              chats.length > 0 ? (
                chats.map((chat) => (
                  <SidebarMenuItem key={chat.id}>
                    <SidebarMenuButton asChild>
                      <Link
                        href={`/chats/${chat.id}`}
                        className="font-medium flex items-center gap-2"
                      >
                        <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                          <Image
                            src={chat.mentorProfile.imageUrl!}
                            fill
                            alt="profile picture"
                            className="object-cover"
                          />
                        </div>
                        <span className="capitalize font-medium truncate">
                          {chat.mentorProfile.user.name}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))
              ) : (
                <div className="flex items-center justify-center">
                  <h1 className="text-xl font-bold">No chats founds</h1>
                </div>
              )
            ) : role === "mentor" ? (
              chats.length > 0 ? (
                chats.map((chat) => {
                  return (
                    <SidebarMenuItem key={chat.id}>
                      <SidebarMenuButton asChild>
                        <Link
                          href={`/chats/${chat.id}`}
                          className="font-medium flex items-center gap-2"
                        >
                          {chat.studentProfile && (
                            <>
                              {chat.studentProfile.imageUrl ? (
                                <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                                  <Image
                                    src={chat.studentProfile.imageUrl}
                                    fill
                                    alt="profile picture"
                                    className="object-cover"
                                  />
                                </div>
                              ) : (
                                <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                                  <Image
                                    src="https://vbteadl6m3.ufs.sh/f/DDJ5nPL6Yp1sHfAviE2zasoidYb10Mu7JGNQFZWgVmCrRHPE"
                                    fill
                                    alt="profile picture"
                                    className="object-cover"
                                  />
                                </div>
                              )}
                              <span className="capitalize font-medium truncate">
                                {chat.studentProfile.user.name}
                              </span>
                            </>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })
              ) : (
                <div className="flex items-center justify-center">
                  <h1 className="text-xl font-bold">No chats found! </h1>
                </div>
              )
            ) : (
              <div className="px-4 py-2">
                <h1 className="text-sm text-muted-foreground">No chat found</h1>
              </div>
            )}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <NavUser
        user={{
          name: currentUser.name,
          email: currentUser.email,
          avatar: currentUser.image || "",
        }}
      />
    </Sidebar>
  );
};

export default Chats;
