"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { MessagesSquare, RotateCw } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { NavUser } from "@/components/ui/nav-user";
import { myChatsQueryOptions } from "@/modules/chats/queries";
import type { MyChat } from "../../../server/actions/chats/list";

export function ChatList({
  user,
}: {
  user: { name: string; email: string; image: string | null };
}) {
  const pathname = usePathname();
  const { data, isError, refetch, isFetching } = useQuery(myChatsQueryOptions());

  return (
    <Sidebar variant="sidebar" className="border-r">
      <SidebarHeader className="border-b">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/" className="flex items-center gap-2">
                <Image
                  src="/logoTransparent.png"
                  alt=""
                  width={36}
                  height={36}
                  className="size-9 object-contain"
                />
                <span className="text-lg font-semibold text-gray-900">
                  NepaliPool
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          {!data ? (
            isError ? (
              <div className="space-y-3 px-2 py-6 text-center">
                <p className="text-sm text-gray-600">
                  Couldn&apos;t load your chats.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isFetching}
                  onClick={() => refetch()}
                >
                  <RotateCw className="size-4" />
                  Try again
                </Button>
              </div>
            ) : (
              <ChatListSkeleton />
            )
          ) : data.length === 0 ? (
            <div className="flex flex-col items-center gap-2 px-4 py-8 text-center">
              <MessagesSquare className="size-8 text-gray-300" />
              <p className="text-sm text-muted-foreground">No chats yet</p>
            </div>
          ) : (
            <SidebarMenu className="gap-2">
              {data.map((chat) => (
                <ChatListItem
                  key={chat.id}
                  chat={chat}
                  active={pathname === `/chats/${chat.id}`}
                />
              ))}
            </SidebarMenu>
          )}
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t">
        <NavUser
          user={{ name: user.name, email: user.email, avatar: user.image ?? "" }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}

function ChatListItem({ chat, active }: { chat: MyChat; active: boolean }) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={active} className="h-12">
        <Link
          href={`/chats/${chat.id}`}
          className="flex items-center gap-3 px-3 font-medium"
        >
          <span className="relative size-9 shrink-0 overflow-hidden rounded-full bg-emerald-50 ring-2 ring-emerald-100">
            {chat.other.imageUrl ? (
              <Image
                src={chat.other.imageUrl}
                alt=""
                fill
                sizes="36px"
                className="object-cover"
              />
            ) : (
              <span className="flex size-full items-center justify-center text-sm font-semibold text-emerald-700">
                {chat.other.name.charAt(0).toUpperCase()}
              </span>
            )}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate font-medium capitalize">
              {chat.other.name}
            </span>
            {chat.status !== "active" && (
              <span className="block text-xs text-amber-700">Expired</span>
            )}
          </span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

export function ChatListSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading chats" className="space-y-2 px-2">
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} className="flex h-12 items-center gap-3 px-1">
          <Skeleton className="size-9 shrink-0 rounded-full" />
          <Skeleton className="h-4 flex-1" />
        </div>
      ))}
    </div>
  );
}
