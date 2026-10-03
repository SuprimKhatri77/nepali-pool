"use server";

import { db } from "../../../lib/db";
import { chats, messages } from "../../../lib/db/schema";
import { and, eq, or } from "drizzle-orm";
import { getCurrentUser } from "../../lib/auth/guards";

const MAX_MESSAGE_LENGTH = 5000;

type SendMessageType =
  | { success: true; messageId: string }
  | { success: false; error: string };
export async function sendMessage(
  message: string,
  senderId: string,
  chatId: string,
  hasAttachment: boolean = false
): Promise<SendMessageType> {
  if (typeof message !== "string" || typeof chatId !== "string" || !chatId) {
    return { success: false, error: "Invalid message" };
  }
  if (!message.trim() && !hasAttachment) {
    return { success: false, error: "Message cannot be empty" };
  }
  if (message.length > MAX_MESSAGE_LENGTH) {
    return { success: false, error: "Message is too long" };
  }

  try {
    const result = await getCurrentUser();
    if (!result.success)
      return { success: result.success, error: result.message };
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
        success: false,
        error: "Chat subscription expired",
      };
    }

    const [newMessage] = await db
      .insert(messages)
      .values({
        // Always the signed-in user; the senderId argument is not trusted.
        senderId: userRecord.id,
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
