import { redirect } from "next/navigation";
import { auth } from "../../../../server/lib/auth/auth";
import { db } from "../../../../lib/db";
import { user } from "../../../../lib/db/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import Chats from "@/components/Chats";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export default async function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const [userRecord] = await db
    .select()
    .from(user)
    .where(eq(user.id, session.user.id));

  if (!userRecord) {
    await auth.api.signOut({ headers: await headers() });
    return redirect("/login?error=invalid_session");
  }
  if (!userRecord.emailVerified) return redirect("/verify-email");
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
      <SidebarInset>
        <header className="flex justify-between h-14 shrink-0 items-center gap-2 border-b px-4">
          <div className="flex">
            <SidebarTrigger className="-ml-1" />
            <div className="flex">
              <Separator orientation="vertical" className="mr-2 h-4" />
              <h1 className="text-lg font-semibold">Messages</h1>
            </div>
          </div>
          <Link
            href={`/dashboard/${role}`}
            className="bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-400 transition-all duration-400 py-2 px-4 rounded-lg font-medium"
          >
            Go to Dashboard
          </Link>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
