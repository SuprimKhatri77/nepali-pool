"use server";

import { VideoCallTypeWithMentorAndStudent } from "@/components/ScheduleCall";
import { db } from "../../lib/db";
import { videoCall } from "../../lib/db/schema";

export async function getVideoCallWithMentorProfile(videoId: string) {
  // if (!videoId) {
  //   return null;
  // }
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
  })) as VideoCallTypeWithMentorAndStudent;
  return result;
}
