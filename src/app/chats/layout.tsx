import type React from "react";
import { requireViewer } from "../../../server/lib/auth/guards";
import Chats from "@/components/Chats";
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
  const viewer = await requireViewer(["student", "mentor"]);
  const userRecord = viewer.user;
  const role = viewer.status;

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "19rem",
        } as React.CSSProperties
      }
    >
      <Chats role={role} currentUser={userRecord} />
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
