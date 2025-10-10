"use server";

import { headers } from "next/headers";
import { db } from "../../../lib/db";
import { chats, messages, user } from "../../../lib/db/schema";
import { auth } from "../../lib/auth/auth";
import { and, eq, or } from "drizzle-orm";
import { getCurrentUser } from "../../lib/auth/helpers/getCurrentUser";

export async function sendMessage(
  message: string,
  senderId: string,
  chatId: string,
  hasAttachment: boolean = false
) {
  if (!chatId || !senderId || (!message.trim() && !hasAttachment)) {
    return { success: false, error: "Message cannot be empty" };
  }

  try {
    const result = await getCurrentUser();
    if (!result.success) return result;
    const userRecord = result.userRecord;

    const chat = await db.query.chats.findFirst({
      where: and(
        eq(chats.id, chatId),
        or(
          eq(chats.studentId, userRecord.id),
          eq(chats.mentorId, userRecord.id)
        )
      ),
    });

    if (!chat) {
      console.error(`User ${userRecord.id} tried to access chat ${chatId}`);
      return { success: false, error: "Chat not found or unauthorized" };
    }

    if (chat.status !== "active") {
      return {
        succes: false,
        error: "Chat subscription expired",
      };
    }

    const [newMessage] = await db
      .insert(messages)
      .values({
        senderId,
        chatId,
        message,
      })
      .returning({ id: messages.id });

    return { success: true, messageId: newMessage.id };
  } catch (error) {
    console.error("Error sending message:", error);
    return { success: false, error: "Failed to send message" };
  }
}
