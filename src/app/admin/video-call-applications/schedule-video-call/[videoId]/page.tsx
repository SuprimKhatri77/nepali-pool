import ScheduleVideoCallWithMentor from "@/components/ScheduleVideoCall";
import { videoCall } from "../../../../../../lib/db/schema";
import { VideoCallWithStudentAndMentor } from "../../../../../../types/all-types";
import { db } from "../../../../../../lib/db";

export default async function Page({
  params,
}: {
  params: Promise<{ videoId: string }>;
}) {
  const { videoId } = await params;
  const videoCallRecord = (await db.query.videoCall.findFirst({
    where: (fields, { eq }) => eq(videoCall.id, videoId),
    with: {
      studentProfile: { with: { user: true } },
      mentorProfile: { with: { user: true } },
    },
  })) as VideoCallWithStudentAndMentor;

  if (!videoCallRecord) {
    return (
      <div className="min-h-screen w-full flex justify-center items-center">
        <h1 className="text-2xl font-bold">
          No record found for video call of id: {videoId}
        </h1>
      </div>
    );
  }
  return <ScheduleVideoCallWithMentor videoCallRecord={videoCallRecord} />;
}
