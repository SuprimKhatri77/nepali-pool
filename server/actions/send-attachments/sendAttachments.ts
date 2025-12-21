"use server";

import { db } from "../../../lib/db";
import { chats, messageAttachments} from "../../../lib/db/schema";
import { and,  or } from "drizzle-orm";
import { getCurrentUser } from "../../lib/auth/helpers/getCurrentUser";

export async function sendAttachments(
  messageId: string,
  uploadedFiles: { url: string; type: string; name: string; id?: string }[],
  chatId: string
) {
  if (!messageId || uploadedFiles.length === 0 || !chatId) {
    return { success: false, error: "Missing required fields" };
  }

  try {
    const result = await getCurrentUser();
    if (!result.success) return result;

    const userRecord = result.userRecord;

    const chat = await db.query.chats.findFirst({
      where: (fields, { eq }) =>
        and(
          eq(chats.id, chatId),
          or(
            eq(chats.mentorId, userRecord.id),
            eq(chats.studentId, userRecord.id)
          )
        ),
    });

    if (!chat) {
      console.error(`User ${userRecord.id} tried to access chat ${chatId}`);
      return { success: "false", error: "Chat not found." };
    }

    await db.insert(messageAttachments).values(
      uploadedFiles.map((file) => ({
        messageId,
        url: file.url,
        type: file.type,
        name: file.name,
      }))
    );
    return { success: true };
  } catch (error) {
    console.error("Error inserting attachments: ", error);
    return { success: false, error: "Error inserting attachments" };
  }
}
