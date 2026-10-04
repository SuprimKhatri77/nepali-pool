import VideoCall from "@/components/VideoCall";
import { db } from "../../../lib/db";
import { videoCall } from "../../../lib/db/schema";
import { requireViewer } from "../../../server/lib/auth/guards";
import { participantColumns } from "../../../server/lib/chats/participant-columns";
import { VideoCallWithParticipants } from "../../../types/all-types";

export default async function Page() {
  const viewer = await requireViewer(["student", "mentor"]);
  const userRecord = viewer.user;

  if (viewer.status === "student") {
    const videoRecords = (await db.query.videoCall.findMany({
      where: (fields, { eq }) => eq(videoCall.studentId, userRecord.id),
      with: {
        studentProfile: participantColumns,
        mentorProfile: participantColumns,
        preferredTime: true,
      },
    })) as VideoCallWithParticipants[];
    // if (videoRecords.length === 0) {
    //   return (
    //     <div className="min-h-screen w-full flex items-center justify-center">
    //       <h1 className="text-2xl font-bold">
    //         No records found for the provided Video ID!
    //       </h1>
    //     </div>
    //   );
    // }
    return <VideoCall videoCallRecords={videoRecords} role={viewer.status} />;
  } else {
    const videoRecords = (await db.query.videoCall.findMany({
      where: (fields, { eq }) => eq(videoCall.mentorId, userRecord.id),
      with: {
        studentProfile: participantColumns,
        mentorProfile: participantColumns,
        preferredTime: true,
      },
    })) as VideoCallWithParticipants[];
    // if (videoRecords.length === 0) {
    //   return (
    //     <div className="min-h-screen w-full flex items-center justify-center">
    //       <h1 className="text-2xl font-bold">
    //         No records found for the provided Video ID!
    //       </h1>
    //     </div>
    //   );
    // }
    return (
      <VideoCall videoCallRecords={videoRecords ?? []} role={viewer.status} />
    );
  }
}
