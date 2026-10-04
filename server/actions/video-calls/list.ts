"use server";

import { and, count, desc, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "../../../lib/db";
import {
  mentorProfile,
  preferredTime,
  studentProfile,
  user,
  videoCall,
  videoCallStatusEnum,
} from "../../../lib/db/schema";
import type { ActionResult } from "../../../src/utils/action-result";
import { getViewer } from "../../lib/auth/viewer";

type VideoCallStatus = (typeof videoCallStatusEnum.enumValues)[number];

export type MyVideoCall = {
  id: string;
  status: VideoCallStatus | null;
  scheduledTime: Date | null;
  requestedAt: Date | null;
  // The other participant: only what the viewer may see.
  other: { name: string; imageUrl: string | null };
  // Who has proposed a time so far (drives "Select" vs "Review" a date).
  proposed: { byStudent: boolean; byMentor: boolean };
};

// A person has a handful of calls; this is a safety cap, not a page size.
const MAX_CALLS = 100;

async function currentParticipant() {
  const viewer = await getViewer();
  if (viewer.status !== "student" && viewer.status !== "mentor") return null;
  return { id: viewer.user.id, isStudent: viewer.status === "student" };
}

const listInput = z.object({ status: z.enum(videoCallStatusEnum.enumValues) });

// The signed-in student's or mentor's video calls with one status, newest
// first.
export async function listMyVideoCalls(input: {
  status: VideoCallStatus;
}): Promise<ActionResult<MyVideoCall[]>> {
  const parsed = listInput.safeParse(input);
  if (!parsed.success) return { success: false, message: "Invalid request" };
  const me = await currentParticipant();
  if (!me) return { success: false, message: "Unauthorized" };

  // The other side: the mentor for a student, the student for a mentor.
  const otherId = me.isStudent ? videoCall.mentorId : videoCall.studentId;
  const otherImage = me.isStudent
    ? mentorProfile.imageUrl
    : studentProfile.imageUrl;

  const rows = await db
    .select({
      id: videoCall.id,
      status: videoCall.status,
      scheduledTime: videoCall.scheduledTime,
      requestedAt: videoCall.createdAt,
      otherName: user.name,
      otherImage,
      studentProposed: preferredTime.studentPreferredTime,
      mentorProposed: preferredTime.mentorPreferredTime,
    })
    .from(videoCall)
    .innerJoin(user, eq(user.id, otherId))
    .leftJoin(
      me.isStudent ? mentorProfile : studentProfile,
      me.isStudent
        ? eq(mentorProfile.userId, videoCall.mentorId)
        : eq(studentProfile.userId, videoCall.studentId),
    )
    .leftJoin(preferredTime, eq(preferredTime.videoId, videoCall.id))
    .where(
      and(
        eq(me.isStudent ? videoCall.studentId : videoCall.mentorId, me.id),
        eq(videoCall.status, parsed.data.status),
      ),
    )
    .orderBy(sql`${videoCall.createdAt} desc nulls last`, desc(videoCall.id))
    .limit(MAX_CALLS);

  return {
    success: true,
    data: rows.map((row) => ({
      id: row.id,
      status: row.status,
      scheduledTime: row.scheduledTime,
      requestedAt: row.requestedAt,
      other: { name: row.otherName, imageUrl: row.otherImage },
      proposed: {
        byStudent: row.studentProposed !== null,
        byMentor: row.mentorProposed !== null,
      },
    })),
  };
}

// Calls per status for the tabs.
export async function getMyVideoCallCounts(): Promise<
  ActionResult<Partial<Record<VideoCallStatus, number>>>
> {
  const me = await currentParticipant();
  if (!me) return { success: false, message: "Unauthorized" };

  const rows = await db
    .select({ status: videoCall.status, total: count() })
    .from(videoCall)
    .where(eq(me.isStudent ? videoCall.studentId : videoCall.mentorId, me.id))
    .groupBy(videoCall.status);

  return {
    success: true,
    data: Object.fromEntries(
      rows.flatMap((row) =>
        row.status ? [[row.status, row.total] as const] : [],
      ),
    ),
  };
}
