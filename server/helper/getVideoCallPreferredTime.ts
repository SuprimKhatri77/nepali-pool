"use server";

import { db } from "../../lib/db";
import { preferredTime } from "../../lib/db/schema";
import { getCurrentUser } from "../lib/auth/helpers/getCurrentUser";

type VideoCallPreferredTime =
  | { success: false; message: string }
  | { success: true };

export async function getVideoCallPreferredTime(
  videoId: string
): Promise<VideoCallPreferredTime> {
  const result = await getCurrentUser();
  if (!result.success) return result;

  try {
    const result = await db.query.preferredTime.findFirst({
      where: (fields, { eq }) => eq(preferredTime.videoId, videoId),
    });
    return { success: true };
  } catch (error) {
    console.error("Something went wrong: ", error);
    return { success: false, message: "Something went wrong" };
  }
}
