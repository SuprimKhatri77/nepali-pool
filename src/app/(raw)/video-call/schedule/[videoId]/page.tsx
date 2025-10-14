import ScheduleCall from "@/components/ScheduleCall";
import { db } from "../../../../../../lib/db";
import { user, videoCall } from "../../../../../../lib/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "../../../../../../server/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ videoId: string }>;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return redirect("/login");
  }
  const [userRecord] = await db
    .select()
    .from(user)
    .where(eq(user.id, session.user.id));
  if (!userRecord) {
    return redirect("/sign-up");
  }
  if (!userRecord.emailVerified) {
    return redirect("/sign-up/verify-email");
  }
  if (!userRecord.role || userRecord.role === "none") {
    return redirect("/select-role");
  }

  if (userRecord.role !== "student" && userRecord.role !== "mentor") {
    return redirect("/");
  }

  const { videoId } = await params;
  if (!videoId) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full">
        <h1 className="text-2xl font-bold">Missing Video ID</h1>
      </div>
    );
  }

  const [videoCallRecord] = await db
    .select()
    .from(videoCall)
    .where(eq(videoCall.id, videoId));
  if (!videoCallRecord) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full">
        <h1 className="text-2xl font-bold">No record found for the Video ID</h1>
      </div>
    );
  }
  return <ScheduleCall videoId={videoId} role={userRecord.role} />;
}
