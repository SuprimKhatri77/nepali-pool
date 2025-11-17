"use server";

import { db } from "../../../../../lib/db";
import { chats } from "../../../../../lib/db/schema";
import { getCurrentStudent } from "../getCurrentStudent";
import { and } from "drizzle-orm";

type ChatType = { success: true; chatId: string } | { success: false };

export async function getOrCreateChat(mentorId: string): Promise<ChatType> {
  const result = await getCurrentStudent();
  if (!result.success) return { success: false };

  let chat = await db.query.chats.findFirst({
    where: (fields, { eq }) =>
      and(
        eq(fields.mentorId, mentorId),
        eq(fields.studentId, result.studentRecord.userId)
      ),
  });

  if (!chat) {
    const [newChat] = await db
      .insert(chats)
      .values({
        mentorId,
        studentId: result.studentRecord.userId,
        status: "active",
      })
      .returning();

    chat = newChat;
  }

  return { success: true, chatId: chat.id };
}
