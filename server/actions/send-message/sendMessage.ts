"use server";

import { db } from "../../../lib/db";
import { messages } from "../../../lib/db/schema";

export async function sendMessage(
  message: string,
  senderId: string,
  chatId: string
) {
  if (!chatId || !senderId) {
    return;
  }

  try {
    const [result] = await db
      .insert(messages)
      .values({
        senderId,
        chatId,
        message,
      })
      .returning({ id: messages.id });

    return result.id ?? null;
  } catch (error) {
    console.error("Error sending message: ", error);
    return false;
  }
}
