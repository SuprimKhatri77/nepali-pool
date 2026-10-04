"use server";

import { db } from "../../lib/db";
import { chats } from "../../lib/db/schema";
import { desc, eq } from "drizzle-orm";
import { getViewer } from "../lib/auth/viewer";
import type { ChatWithParticipants } from "../../types/all-types";
import { participantColumns } from "../lib/chats/participant-columns";

type UserChatType =
  | { success: true; chatsRecords: ChatWithParticipants[] }
  | { success: false; message: string; chatsRecords: [] };

// The signed-in student's or mentor's chats, most recent first. Each side
// only gets the other's name and photo.
export async function getUserChats(): Promise<UserChatType> {
  const viewer = await getViewer();
  if (viewer.status !== "student" && viewer.status !== "mentor") {
    return { success: false, message: "Unauthorized", chatsRecords: [] };
  }

  try {
    const chatsRecords = await db.query.chats.findMany({
      where:
        viewer.status === "student"
          ? eq(chats.studentId, viewer.user.id)
          : eq(chats.mentorId, viewer.user.id),
      with: {
        studentProfile: participantColumns,
        mentorProfile: participantColumns,
      },
      orderBy: [desc(chats.lastMessageAt)],
    });

    return { success: true, chatsRecords };
  } catch (error) {
    console.error("Error: ", error);
    return {
      success: false,
      message: "Something went wrong",
      chatsRecords: [],
    };
  }
}
