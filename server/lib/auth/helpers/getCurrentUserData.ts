"use server";

import { and, eq, or } from "drizzle-orm";
import { db } from "../../../../lib/db";
import {
  chatSubscription,
  studentProfile,
  user,
  videoCall,
} from "../../../../lib/db/schema";

type CurrentUserData =
  | {
      success: false;
      role: "student";
      chatId: null;
      videoCallId: null;
      userId: string;
      email: string;
    }
  | {
      success: true;
      role: "student";
      chatId: string | null;
      videoCallId: string | null;
      videoCallStatus:
        | "pending"
        | "scheduled"
        | "cancelled"
        | "completed"
        | null;
      userId: string;
      email: string;
    }
  | {
      success: false;
      role: "mentor" | "admin" | "none" | null;
    };

export async function getCurrentUserData(
  userId: string,
  mentorId: string
): Promise<CurrentUserData> {
  const [userRecord] = await db.select().from(user).where(eq(user.id, userId));
  if (!userRecord) return { success: false, role: null };
  if (userRecord.role !== "student")
    return { success: false, role: userRecord.role };

  const [studentRecord] = await db
    .select()
    .from(studentProfile)
    .where(eq(studentProfile.userId, userRecord.id));
  if (!studentRecord) return { success: false, role: null };

  const chatRecord = await db.query.chatSubscription.findFirst({
    where: (fields, { eq }) =>
      and(
        eq(chatSubscription.studentId, userId),
        eq(chatSubscription.mentorId, mentorId),
        eq(chatSubscription.status, "active")
      ),
    with: {
      chat: true,
    },
  });

  const videoCallRecord = await db.query.videoCall.findFirst({
    where: (fields, { eq }) =>
      and(
        eq(videoCall.studentId, userId),
        eq(videoCall.mentorId, mentorId),
        or(eq(videoCall.status, "pending"), eq(videoCall.status, "scheduled"))
      ),
  });
  if (!chatRecord && !videoCallRecord)
    return {
      success: false,
      role: userRecord.role,
      chatId: null,
      videoCallId: null,
      userId: studentRecord.userId,
      email: userRecord.email,
    };

  return {
    success: true,
    // the below key's value was changed from chatRecord?.chat.id ?? null
    chatId: chatRecord?.id ?? null,
    videoCallId: videoCallRecord?.id ?? null,
    role: userRecord.role,
    videoCallStatus: videoCallRecord?.status ?? null,
    userId: studentRecord.userId,
    email: userRecord.email,
  };
}
