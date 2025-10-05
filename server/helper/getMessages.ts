"use server";

import { headers } from "next/headers";
import { db } from "../../lib/db";
import { chats, messages } from "../../lib/db/schema";
import { auth } from "../lib/auth/auth";
import { and, eq, or, lt, desc } from "drizzle-orm";

export async function getMessages(chatId: string, limit: number = 20) {
  if (!chatId) {
    return {
      success: false,
      error: "Chat ID is required",
      messages: [],
      hasMore: false,
    };
  }

  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      console.error("Unauthorized access");
      return {
        success: false,
        error: "Unauthorized",
        messages: [],
        hasMore: false,
      };
    }

    const chat = await db.query.chats.findFirst({
      where: and(
        eq(chats.id, chatId),
        or(
          eq(chats.studentId, session.user.id),
          eq(chats.mentorId, session.user.id)
        )
      ),
    });

    if (!chat) {
      console.error(`User ${session.user.id} unauthorized for chat ${chatId}`);
      return {
        success: false,
        error: "Unauthorized",
        messages: [],
        hasMore: false,
      };
    }

    const messageRecords = await db.query.messages.findMany({
      where: eq(messages.chatId, chatId),
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
        messageAttachments: true,
      },
      orderBy: [desc(messages.createdAt)],
      limit: limit + 1,
    });

    const hasMore = messageRecords.length > limit;
    const messagesToReturn = hasMore
      ? messageRecords.slice(0, limit)
      : messageRecords;

    return {
      success: true,
      messages: messagesToReturn.reverse(),
      hasMore,
    };
  } catch (error) {
    console.error("Error fetching messages:", error);
    return {
      success: false,
      error: "Failed to fetch messages",
      messages: [],
      hasMore: false,
    };
  }
}

export async function getMoreMessages(
  chatId: string,
  oldestMessageId: string,
  limit: number = 20
) {
  if (!chatId || !oldestMessageId) {
    return {
      success: false,
      error: "Invalid parameters",
      messages: [],
      hasMore: false,
    };
  }

  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return {
        success: false,
        error: "Unauthorized",
        messages: [],
        hasMore: false,
      };
    }

    const chat = await db.query.chats.findFirst({
      where: and(
        eq(chats.id, chatId),
        or(
          eq(chats.studentId, session.user.id),
          eq(chats.mentorId, session.user.id)
        )
      ),
    });

    if (!chat) {
      return {
        success: false,
        error: "Unauthorized",
        messages: [],
        hasMore: false,
      };
    }

    const oldestMessage = await db.query.messages.findFirst({
      where: eq(messages.id, oldestMessageId),
    });

    if (!oldestMessage) {
      return {
        success: false,
        error: "Message not found",
        messages: [],
        hasMore: false,
      };
    }

    const messageRecords = await db.query.messages.findMany({
      where: and(
        eq(messages.chatId, chatId),
        lt(messages.createdAt, oldestMessage.createdAt!)
      ),
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
        messageAttachments: true,
      },
      orderBy: [desc(messages.createdAt)],
      limit: limit + 1,
    });

    const hasMore = messageRecords.length > limit;
    const messagesToReturn = hasMore
      ? messageRecords.slice(0, limit)
      : messageRecords;

    return {
      success: true,
      messages: messagesToReturn.reverse(),
      hasMore,
    };
  } catch (error) {
    console.error("Error fetching more messages:", error);
    return {
      success: false,
      error: "Failed to fetch messages",
      messages: [],
      hasMore: false,
    };
  }
}
