"use server";

import { db } from "../../lib/db";
import { videoCall } from "../../lib/db/schema";
import { VideoCallWithStudentAndMentor } from "../../types/all-types";
import { getCurrentUser } from "../lib/auth/helpers/getCurrentUser";

type VideoCallRecord =
  | {
      success: true;
      videoCallRecordWithStudentAndMentor: VideoCallWithStudentAndMentor;
    }
  | { success: false; message: string };

export async function getVideoCallRecordWithStudentAndMentor(
  videoId: string
): Promise<VideoCallRecord> {
  const currentUser = await getCurrentUser();
  if (!currentUser.success) return currentUser;
  try {
    const result = (await db.query.videoCall.findFirst({
      where: (fields, { eq }) => eq(videoCall.id, videoId),
      with: {
        mentorProfile: {
          with: {
            user: true,
          },
        },
        preferredTime: true,
        studentProfile: {
          with: {
            user: true,
          },
        },
      },
    })) as VideoCallWithStudentAndMentor;
    return { success: true, videoCallRecordWithStudentAndMentor: result };
  } catch (error) {
    console.error("Error: ", error);
    return { success: false, message: "Something went wrong!" };
  }
}
