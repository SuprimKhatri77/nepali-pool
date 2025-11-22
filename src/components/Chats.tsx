"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import { getUserChats } from "../../server/helper/getUserChats";
import type {
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
    <Sidebar variant="sidebar" className="border-r">
      <SidebarHeader className="flex flex-row items-center justify-between border-b">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div
              className="w-9 h-9 sm:w-10 sm:h-10  rounded-lg flex items-center justify-center text-white font-bold shadow-sm group-hover:shadow-md transition-all duration-200"
             
            >
              <Image
                src={"/logoTransparent.png"}
                alt="NepaliPool Transparent Logo"
                width={150}
                height={70}
              />
            </div>
            <span className="font-semibold text-lg sm:text-xl text-gray-900 group-hover:text-emerald-600 transition-colors duration-200">
              NepaliPool
            </span>
          </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu className="gap-2">
            {loading ? (
              <div className="flex flex-col gap-4 px-2">
                <Skeleton className="h-12 w-full rounded-lg" />
                <Skeleton className="h-12 w-full rounded-lg" />
                <Skeleton className="h-12 w-full rounded-lg" />
                <Skeleton className="h-12 w-full rounded-lg" />
                <Skeleton className="h-12 w-full rounded-lg" />
                <Skeleton className="h-12 w-full rounded-lg" />
              </div>
            ) : role === "student" ? (
              chats.length > 0 ? (
                chats.map((chat) => (
                  <SidebarMenuItem key={chat.id}>
                    <SidebarMenuButton asChild className="h-12">
                      <Link
                        href={`/chats/${chat.id}`}
                        className="font-medium flex items-center gap-3 px-3"
                      >
                        <div className="relative w-9 h-9 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-emerald-100">
                          <Image
                            src={
                              chat.mentorProfile.imageUrl! || "/placeholder.svg"
                            }
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
                <div className="flex items-center justify-center py-8">
                  <p className="text-sm text-muted-foreground">
                    No chats found
                  </p>
                </div>
              )
            ) : role === "mentor" ? (
              chats.length > 0 ? (
                chats.map((chat) => {
                  return (
                    <SidebarMenuItem key={chat.id}>
                      <SidebarMenuButton asChild className="h-12">
                        <Link
                          href={`/chats/${chat.id}`}
                          className="font-medium flex items-center gap-3 px-3"
                        >
                          {chat.studentProfile && (
                            <>
                              {chat.studentProfile.imageUrl ? (
                                <div className="relative w-9 h-9 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-emerald-100">
                                  <Image
                                    src={
                                      chat.studentProfile.imageUrl ||
                                      "/placeholder.svg"
                                    }
                                    fill
                                    alt="profile picture"
                                    className="object-cover"
                                  />
                                </div>
                              ) : (
                                <div className="relative w-9 h-9 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-emerald-100">
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
                <div className="flex items-center justify-center py-8">
                  <p className="text-sm text-muted-foreground">
                    No chats found
                  </p>
                </div>
              )
            ) : (
              <div className="px-4 py-8">
                <p className="text-sm text-muted-foreground">No chat found</p>
              </div>
            )}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t">
        <NavUser
          user={{
            name: currentUser.name,
            email: currentUser.email,
            avatar: currentUser.image || "",
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
};

export default Chats;
