import type React from "react";
import { redirect } from "next/navigation";
import { auth } from "../../../server/lib/auth/auth";
import { db } from "../../../lib/db";
import { user } from "../../../lib/db/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
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
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login?message=Please+login+to+continue");

  const [userRecord] = await db
    .select()
    .from(user)
    .where(eq(user.id, session.user.id));

  if (!userRecord) {
    await auth.api.signOut({ headers: await headers() });
    return redirect("/login?error=invalid_session");
  }
  if (!userRecord.emailVerified)
    return redirect("/verify-email?message=Please+verify+your+email");
  if (!userRecord.role || userRecord.role === "none")
    return redirect("/select-role");

  const role = userRecord.role as "student" | "mentor";

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
