"use server";

import z from "zod";
import { db } from "../../../lib/db";
import { messageAttachments } from "../../../lib/db/schema";
import { getCurrentUser } from "../../lib/auth/guards";

// Chat attachments are uploaded to this app's Cloudinary account by the
// upload widget in Message.tsx; anything else is rejected.
function isOwnCloudinaryUrl(value: string) {
  try {
    const url = new URL(value);
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    return (
      !!cloudName &&
      url.protocol === "https:" &&
      url.hostname === "res.cloudinary.com" &&
      url.pathname.startsWith(`/${cloudName}/`)
    );
  } catch {
    return false;
  }
}

const attachmentsSchema = z.object({
  messageId: z.uuid(),
  chatId: z.uuid(),
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
    .min(1)
    .max(10),
});

export async function sendAttachments(
  messageId: string,
  uploadedFiles: { url: string; type: string; name: string; id?: string }[],
  chatId: string
) {
  const parsed = attachmentsSchema.safeParse({
    messageId,
    chatId,
    files: uploadedFiles,
  });
  if (!parsed.success) {
    return { success: false, error: "Invalid attachments" };
  }

  try {
    const result = await getCurrentUser();
    if (!result.success) return { success: false, error: result.message };
    const userRecord = result.userRecord;

    // The message must be the caller's own, in an active chat.
    const message = await db.query.messages.findFirst({
      columns: { id: true },
      where: (fields, { and, eq }) =>
        and(
          eq(fields.id, parsed.data.messageId),
          eq(fields.chatId, parsed.data.chatId),
          eq(fields.senderId, userRecord.id),
        ),
      with: { chats: { columns: { status: true } } },
    });
    if (!message || message.chats?.status !== "active") {
      console.error(
        `User ${userRecord.id} tried to attach files to message ${parsed.data.messageId}`,
      );
      return { success: false, error: "Message not found." };
    }

    await db.insert(messageAttachments).values(
      parsed.data.files.map((file) => ({
        messageId: parsed.data.messageId,
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
