import VideoCallApplicationsPage from "@/components/VideoCallApplications";
import { db } from "../../../../../lib/db";
import { VideoCallWithStudentAndMentor } from "../../../../../types/all-types";

export default async function Page() {
  const videoCallRecords = (await db.query.videoCall.findMany({
    with: {
      studentProfile: { with: { user: true } },
      mentorProfile: { with: { user: true } },
    },
  })) as VideoCallWithStudentAndMentor[] | [];
  if (videoCallRecords.length === 0) {
    return (
      <div>
        <h1>No video call applications records.</h1>
      </div>
    );
  }

  return <VideoCallApplicationsPage videoCallRecords={videoCallRecords} />;
}
