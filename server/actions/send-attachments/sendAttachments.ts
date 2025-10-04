"use server";

import { db } from "../../../lib/db";
import { messageAttachments } from "../../../lib/db/schema";

export async function sendAttachments(
  messageId: string,
  uploadedFiles: { url: string; type: string; name: string }[]
) {
  if (!messageId || uploadedFiles.length === 0) return;

  try {
    await db.insert(messageAttachments).values(
      uploadedFiles.map((file) => ({
        messageId,
        url: file.url,
        type: file.type,
        name: file.name,
      }))
    );
  } catch (error) {
    console.error("Error inserting attachments: ", error);
  }
}
