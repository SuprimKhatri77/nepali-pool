"use server";

import { db } from "../../../lib/db";
import { messages } from "../../../lib/db/schema";

export async function sendMessage(
  message: string,
  senderId: string,
  chatId: string,
  attachmentUrl?: string
) {
  if (!chatId || !senderId) {
    return;
  }

  try {
    await db.insert(messages).values({
      senderId,
      chatId,
      message,
    });
    return true;
  } catch (error) {
    console.error("Error sending message: ", error);
    return false;
  }
}
