"use server";

import { db } from "../../../../../lib/db";
import { chats } from "../../../../../lib/db/schema";

type ChatType =
  | { success: true; chatId: string; role: "student"; userId: string }
  | { success: false; errorType?: "no_student_profile" | "not_a_student" };
export async function getChatStatus(
  mentorId: string,
  userId: string
): Promise<ChatType> {
  if (!mentorId || !userId) {
    return { success: false };
  }

  const userRecord = await db.query.user.findFirst({
    where: (fields, { eq }) => eq(fields.id, userId),
  });
  if (!userRecord || userRecord.role !== "student")
    return { success: false, errorType: "not_a_student" };
  const studentRecord = await db.query.studentProfile.findFirst({
    where: (fields, { eq }) => eq(fields.userId, userRecord.id),
  });
  if (!studentRecord)
    return { success: false, errorType: "no_student_profile" };

  const chatRecord = await db.query.chats.findFirst({
    where: (fields, { eq, and }) =>
      and(eq(fields.mentorId, mentorId), eq(fields.studentId, userId)),
  });

  if (!chatRecord) {
    const [newChat] = await db
      .insert(chats)
      .values({
        studentId: userId,
        mentorId,
        status: "active",
      })
      .returning({ id: chats.id });

    return {
      success: true,
      chatId: newChat.id,
      userId: userRecord.id,
      role: "student",
    };
  }
  return {
    success: true,
    chatId: chatRecord.id,
    role: "student",
    userId: userRecord.id,
  };
}
