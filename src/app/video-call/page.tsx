import VideoCall from "@/components/VideoCall";
import { db } from "../../../lib/db";
import { user, videoCall } from "../../../lib/db/schema";
import { auth } from "../../../server/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { VideoCallWithStudentAndMentor } from "../../../types/all-types";

export default async function Page() {
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

  if (userRecord.role === "student") {
    const videoRecords = (await db.query.videoCall.findMany({
      where: (fields, { eq }) => eq(videoCall.studentId, userRecord.id),
      with: {
        studentProfile: { with: { user: true } },
        mentorProfile: { with: { user: true } },
        preferredTime: true,
      },
    })) as VideoCallWithStudentAndMentor[];
    if (videoRecords.length === 0) {
      return (
        <div className="min-h-screen w-full flex items-center justify-center">
          <h1 className="text-2xl font-bold">
            No records found for the provided Video ID!
          </h1>
        </div>
      );
    }
    return <VideoCall videoCallRecords={videoRecords} role={userRecord.role} />;
  } else if (userRecord.role === "mentor") {
    const videoRecords = (await db.query.videoCall.findMany({
      where: (fields, { eq }) => eq(videoCall.mentorId, userRecord.id),
      with: {
        studentProfile: { with: { user: true } },
        mentorProfile: { with: { user: true } },
        preferredTime: true,
      },
    })) as VideoCallWithStudentAndMentor[];
    if (videoRecords.length === 0) {
      return (
        <div className="min-h-screen w-full flex items-center justify-center">
          <h1 className="text-2xl font-bold">
            No records found for the provided Video ID!
          </h1>
        </div>
      );
    }
    return <VideoCall videoCallRecords={videoRecords} role={userRecord.role} />;
  }
  return redirect("/select-role");
}
