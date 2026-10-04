"use server";

import { and, asc, desc, eq, inArray, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "../../../lib/db";
import { chats, messageAttachments, messages } from "../../../lib/db/schema";
import type { ActionResult, CursorPage } from "../../../src/utils/action-result";
import { getParticipantChat, isOwnCloudinaryUrl } from "../../lib/chats/access";
import {
  PAGE_SIZE,
  afterCursor,
  cursorTimestamp,
  parseCursor,
  sinceCursor,
  toCursorPage,
} from "../../lib/pagination/keyset";

export type ChatAttachment = {
  id: string;
  url: string;
  type: string | null;
  name: string | null;
};

export type ChatMessage = {
  id: string;
  senderId: string | null;
  message: string | null;
  createdAt: Date | null;
  // `<created_at>_<id>`: orders messages and anchors "what's new" queries.
  cursor: string;
  attachments: ChatAttachment[];
};

const MAX_MESSAGE_LENGTH = 5000;
const MAX_ATTACHMENTS = 10;
// How far back a "what's new" query reaches past the newest message the
// client has, to catch messages committed out of order.
const NEW_MESSAGES_OVERLAP_SECONDS = 30;
const NEW_MESSAGES_LIMIT = 100;

// `messages.created_at` is a timestamp without time zone holding UTC.
const naive = { naive: true };
const messageCursorTs = cursorTimestamp(messages.createdAt, naive);

const messageColumns = {
  id: messages.id,
  senderId: messages.senderId,
  message: messages.message,
  createdAt: messages.createdAt,
  cursorTs: messageCursorTs,
};

type MessageRow = {
  id: string;
  senderId: string | null;
  message: string | null;
  createdAt: Date | null;
  cursorTs: string;
};

// One query for all the attachments of a batch of messages.
async function withAttachments(rows: MessageRow[]): Promise<ChatMessage[]> {
  if (rows.length === 0) return [];
  const attachments = await db
    .select({
      id: messageAttachments.id,
      messageId: messageAttachments.messageId,
      url: messageAttachments.url,
      type: messageAttachments.type,
      name: messageAttachments.name,
    })
    .from(messageAttachments)
    .where(
      inArray(
        messageAttachments.messageId,
        rows.map((row) => row.id),
      ),
    )
    .orderBy(asc(messageAttachments.createdAt), asc(messageAttachments.id));

  const byMessage = new Map<string, ChatAttachment[]>();
  for (const { messageId, ...attachment } of attachments) {
    if (!messageId) continue;
    byMessage.set(messageId, [...(byMessage.get(messageId) ?? []), attachment]);
  }
  return rows.map(({ cursorTs, ...row }) => ({
    ...row,
    cursor: `${cursorTs}_${row.id}`,
    attachments: byMessage.get(row.id) ?? [],
  }));
}

const listInput = z.object({
  chatId: z.uuid(),
  cursor: z.string().max(100).nullable(),
});

// A page of history, newest first; the cursor walks back in time.
export async function listChatMessages(input: {
  chatId: string;
  cursor: string | null;
}): Promise<ActionResult<CursorPage<ChatMessage>>> {
  const parsed = listInput.safeParse(input);
  if (!parsed.success) return { success: false, message: "Invalid request" };
  const cursor = parseCursor(parsed.data.cursor);
  if (cursor === "invalid") return { success: false, message: "Invalid page" };

  const access = await getParticipantChat(parsed.data.chatId);
  if (!access.success) return access;

  const rows = await db
    .select(messageColumns)
    .from(messages)
    .where(
      and(
        eq(messages.chatId, access.chat.id),
        cursor
          ? afterCursor(messages.createdAt, messages.id, cursor, naive)
          : undefined,
      ),
    )
    .orderBy(desc(messages.createdAt), desc(messages.id))
    .limit(PAGE_SIZE + 1);

  const page = toCursorPage(rows, (row) => row.id, (row) => row);
  return {
    success: true,
    data: { items: await withAttachments(page.items), nextCursor: page.nextCursor },
  };
}

const newInput = z.object({ chatId: z.uuid(), since: z.string().max(100) });

// Messages from around the newest one the client has onwards, oldest first.
// `complete: false` means there were more than fit: reload instead of merge.
export async function listNewChatMessages(input: {
  chatId: string;
  since: string;
}): Promise<ActionResult<{ items: ChatMessage[]; complete: boolean }>> {
  const parsed = newInput.safeParse(input);
  if (!parsed.success) return { success: false, message: "Invalid request" };
  const since = parseCursor(parsed.data.since);
  if (!since || since === "invalid") {
    return { success: false, message: "Invalid request" };
  }

  const access = await getParticipantChat(parsed.data.chatId);
  if (!access.success) return access;

  const rows = await db
    .select(messageColumns)
    .from(messages)
    .where(
      and(
        eq(messages.chatId, access.chat.id),
        sinceCursor(
          messages.createdAt,
          since,
          NEW_MESSAGES_OVERLAP_SECONDS,
          naive,
        ),
      ),
    )
    .orderBy(asc(messages.createdAt), asc(messages.id))
    .limit(NEW_MESSAGES_LIMIT + 1);

  return {
    success: true,
    data: {
      items: await withAttachments(rows.slice(0, NEW_MESSAGES_LIMIT)),
      complete: rows.length <= NEW_MESSAGES_LIMIT,
    },
  };
}

const sendInput = z
  .object({
    chatId: z.uuid(),
    text: z.string().trim().max(MAX_MESSAGE_LENGTH, "Message is too long"),
    files: z
      .array(
        z.object({
          url: z.string().refine(isOwnCloudinaryUrl, "Invalid file URL"),
          type: z.string().trim().min(1).max(100),
          // Long file names are shortened rather than failing the upload.
          name: z
            .string()
            .trim()
            .min(1)
            .transform((name) => name.slice(0, 255)),
        }),
      )
      .max(MAX_ATTACHMENTS, `Up to ${MAX_ATTACHMENTS} files per message`),
  })
  .refine((value) => value.text.length > 0 || value.files.length > 0, {
    message: "Message cannot be empty",
  });

// The message and its attachments land in one transaction, so a realtime
// "new message" event never arrives before the files exist, and a failed
// attachment insert doesn't leave a half-sent message behind.
export async function sendChatMessage(input: {
  chatId: string;
  text: string;
  files: { url: string; type: string; name: string }[];
}): Promise<ActionResult<ChatMessage>> {
  const parsed = sendInput.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Invalid message",
    };
  }
  const { text, files } = parsed.data;

  const access = await getParticipantChat(parsed.data.chatId);
  if (!access.success) return access;
  if (access.chat.status !== "active") {
    return { success: false, message: "This chat has expired" };
  }

  const row = await db.transaction(async (tx) => {
    const [inserted] = await tx
      .insert(messages)
      .values({
        // Always the signed-in user, never something the client sent.
        senderId: access.viewerId,
        chatId: access.chat.id,
        message: text || null,
      })
      .returning(messageColumns);
    if (files.length > 0) {
      await tx.insert(messageAttachments).values(
        files.map((file) => ({ messageId: inserted.id, ...file })),
      );
    }
    // Keeps the chat list ordered by latest activity.
    await tx
      .update(chats)
      .set({ lastMessageAt: sql`now()` })
      .where(eq(chats.id, access.chat.id));
    return inserted;
  });

  const [message] = await withAttachments([row]);
  return { success: true, data: message };
}
