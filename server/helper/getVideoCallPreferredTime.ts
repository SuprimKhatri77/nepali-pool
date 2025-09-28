"use server";

import { db } from "../../lib/db";
import { preferredTime } from "../../lib/db/schema";

export async function getVideoCallPreferredTime(videoId: string) {
  try {
    const result = await db.query.preferredTime.findFirst({
      where: (fields, { eq }) => eq(preferredTime.videoId, videoId),
    });
    return true;
  } catch (error) {
    console.error("Something went wrong: ", error);
    return false;
  }
}
