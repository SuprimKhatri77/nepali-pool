"use server";

import { headers } from "next/headers";
import { db } from "../../../lib/db";
import { chats, messages, user } from "../../../lib/db/schema";
import { auth } from "../../lib/auth/auth";
import { and, eq, or } from "drizzle-orm";

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
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      console.error("Unauthorized access!");
      return { success: false, error: "Unauthorized" };
    }

    if (session.user.id !== senderId) {
      console.error("Unauthorized sender!");
      return { success: false, error: "Sender ID mismatch" };
    }

    const [userRecord] = await db
      .select()
      .from(user)
      .where(eq(user.id, session.user.id));

    if (!userRecord) {
      return { success: false, error: "User not found" };
    }

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

    const [result] = await db
      .insert(messages)
      .values({
        senderId,
        chatId,
        message,
      })
      .returning({ id: messages.id });

    return { success: true, messageId: result.id };
  } catch (error) {
    console.error("Error sending message:", error);
    return { success: false, error: "Failed to send message" };
  }
}
