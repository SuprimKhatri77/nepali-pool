"use server";

import { db } from "../../../../../lib/db";
import { chats } from "../../../../../lib/db/schema";
import { getCurrentStudent } from "../../guards";
import { and } from "drizzle-orm";

type ChatType = { success: true; chatId: string } | { success: false };

export async function getOrCreateChat(mentorId: string): Promise<ChatType> {
  const result = await getCurrentStudent();
  if (!result.success) return { success: false };
  if (typeof mentorId !== "string" || !mentorId) return { success: false };

  // Only approved mentors can be messaged.
  const mentor = await db.query.mentorProfile.findFirst({
    columns: { userId: true },
    where: (fields, { and, eq }) =>
      and(eq(fields.userId, mentorId), eq(fields.verifiedStatus, "accepted")),
  });
  if (!mentor) return { success: false };

  const studentId = result.studentRecord.userId;
  // Insert-or-ignore, then read: safe when two clicks race.
  await db
    .insert(chats)
    .values({ mentorId, studentId, status: "active" })
    .onConflictDoNothing();
  const chat = await db.query.chats.findFirst({
    columns: { id: true },
    where: (fields, { eq }) =>
      and(eq(fields.mentorId, mentorId), eq(fields.studentId, studentId)),
  });
  if (!chat) return { success: false };

  return { success: true, chatId: chat.id };
}
