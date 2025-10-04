"use server";

import { db } from "../../lib/db";
import { messages } from "../../lib/db/schema";

export async function getMessages(chatId: string) {
  if (!chatId) return;
  try {
    const messageRecords = await db.query.messages.findMany({
      where: (fields, { eq }) => eq(messages.chatId, chatId),
      with: {
        chats: {
          with: {
            studentProfile: {
              with: {
                user: true,
              },
            },
            mentorProfile: {
              with: {
                user: true,
              },
            },
          },
        },
      },
    });

    return messageRecords ?? [];
  } catch (error) {
    console.error("Error fetching messages: ", error);
    return [];
  }
}
