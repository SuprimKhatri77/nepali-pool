import type React from "react";
import { requireViewer } from "../../../server/lib/auth/guards";
import { ChatList } from "@/components/chat/chat-list";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

export default async function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await requireViewer(["student", "mentor"]);

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "19rem",
        } as React.CSSProperties
      }
    >
      <ChatList
        user={{ name: user.name, email: user.email, image: user.image }}
      />
      <SidebarInset className="flex relative flex-col">
        <header className="flex sticky top-0 z-20 bg-white h-14 shrink-0 items-center gap-2 border-b border-gray-200 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-lg font-semibold text-gray-900">Messages</h1>
        </header>
        <div className="p-4 z-10 bg-white  ">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
