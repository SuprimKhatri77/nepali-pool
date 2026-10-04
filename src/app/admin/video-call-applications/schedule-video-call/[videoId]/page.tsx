import { requireAdmin } from "../../../../../../server/lib/auth/guards";
import ScheduleVideoCallWithMentor from "@/components/ScheduleVideoCall";
import { videoCall } from "../../../../../../lib/db/schema";
import { VideoCallWithStudentAndMentor } from "../../../../../../types/all-types";
import { db } from "../../../../../../lib/db";
import { z } from "zod";
import { AdminNotFound } from "@/components/admin/AdminNotFound";

function NotFound() {
  return (
    <AdminNotFound
      title="Video call not found"
      backHref="/admin/video-call-applications"
      backLabel="Back to video call requests"
    />
  );
}

export default async function Page({
  params,
}: {
  params: Promise<{ videoId: string }>;
}) {
  await requireAdmin();
  const { videoId } = await params;
  // Not uuid-shaped: Postgres would reject the comparison and 500 the page.
  // (z.guid accepts what Postgres accepts; z.uuid also checks the version.)
  if (!z.guid().safeParse(videoId).success) return <NotFound />;
  const videoCallRecord = (await db.query.videoCall.findFirst({
    where: (fields, { eq }) => eq(videoCall.id, videoId),
    with: {
      studentProfile: { with: { user: true } },
      mentorProfile: { with: { user: true } },
    },
  })) as VideoCallWithStudentAndMentor;

  if (!videoCallRecord) return <NotFound />;
  return <ScheduleVideoCallWithMentor videoCallRecord={videoCallRecord} />;
}
