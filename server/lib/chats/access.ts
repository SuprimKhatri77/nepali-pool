import "server-only";

import { and, eq, or } from "drizzle-orm";
import { db } from "../../../lib/db";
import { chats, type ChatsSelectType } from "../../../lib/db/schema";
import { getViewer } from "../auth/viewer";

type ChatAccess =
  | { success: true; chat: ChatsSelectType; viewerId: string }
  | { success: false; message: string };

// The chat, if the signed-in student or approved mentor takes part in it.
// Someone else's chat looks exactly like a missing one.
export async function getParticipantChat(chatId: string): Promise<ChatAccess> {
  const viewer = await getViewer();
  if (viewer.status !== "student" && viewer.status !== "mentor") {
    return { success: false, message: "Unauthorized" };
  }
  const viewerId = viewer.user.id;

  const chat = await db.query.chats.findFirst({
    where: and(
      eq(chats.id, chatId),
      or(eq(chats.studentId, viewerId), eq(chats.mentorId, viewerId)),
    ),
  });
  if (!chat) return { success: false, message: "Chat not found" };
  return { success: true, chat, viewerId };
}

// Chat attachments are uploaded to this app's Cloudinary account by the
// upload widget; anything else is rejected.
export function isOwnCloudinaryUrl(value: string) {
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
