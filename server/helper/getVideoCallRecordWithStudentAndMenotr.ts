"use server";

import { unstable_noStore } from "next/cache";
import z from "zod";
import { db } from "../../lib/db";
import { videoCall } from "../../lib/db/schema";
import { VideoCallWithStudentAndMentor } from "../../types/all-types";
import { getCurrentUser } from "../lib/auth/guards";

type VideoCallRecord =
  | {
      success: true;
      videoCallRecordWithStudentAndMentor: VideoCallWithStudentAndMentor;
    }
  | { success: false; message: string };

export async function getVideoCallRecordWithStudentAndMentor(
  videoId: string
): Promise<VideoCallRecord> {
  unstable_noStore();
  const currentUser = await getCurrentUser();
  if (!currentUser.success) return currentUser;
  if (!z.uuid().safeParse(videoId).success) {
    return { success: false, message: "Invalid video call" };
  }
  const userId = currentUser.userRecord.id;
  try {
    // Only the student or mentor on the call may read it.
    const result = (await db.query.videoCall.findFirst({
      where: (fields, { and, eq, or }) =>
        and(
          eq(videoCall.id, videoId),
          or(eq(fields.studentId, userId), eq(fields.mentorId, userId))
        ),
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
    })) as VideoCallWithStudentAndMentor | undefined;
    if (!result) return { success: false, message: "No record found" };
    return { success: true, videoCallRecordWithStudentAndMentor: result };
  } catch (error) {
    console.error("Error: ", error);
    return { success: false, message: "Something went wrong!" };
  }
}
