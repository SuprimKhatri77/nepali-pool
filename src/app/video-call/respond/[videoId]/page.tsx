import ScheduleCall from "@/components/ScheduleCall";
import { notFound } from "next/navigation";
import z from "zod";
import { db } from "../../../../../lib/db";
import { requireViewer } from "../../../../../server/lib/auth/guards";

export default async function Page({
  params,
}: {
  params: Promise<{ videoId: string }>;
}) {
  const viewer = await requireViewer(["mentor"]);

  const { videoId } = await params;
  if (!z.uuid().safeParse(videoId).success) return notFound();

  // Only the student or mentor on this call may open it.
  const videoCallRecord = await db.query.videoCall.findFirst({
    columns: { id: true },
    where: (fields, { and, eq, or }) =>
      and(
        eq(fields.id, videoId),
        or(
          eq(fields.studentId, viewer.user.id),
          eq(fields.mentorId, viewer.user.id)
        )
      ),
  });
  if (!videoCallRecord) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full">
        <h1 className="text-2xl font-bold">No record found for the Video ID</h1>
      </div>
    );
  }
  return <ScheduleCall videoId={videoId} role={viewer.status} />;
}
