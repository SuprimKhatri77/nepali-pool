"use server";

import { desc, eq, sql } from "drizzle-orm";
import { db } from "../../../lib/db";
import {
  chats,
  mentorProfile,
  studentProfile,
  user,
  type ChatsSelectType,
} from "../../../lib/db/schema";
import type { ActionResult } from "../../../src/utils/action-result";
import { getViewer } from "../../lib/auth/viewer";

export type MyChat = {
  id: string;
  status: ChatsSelectType["status"];
  lastMessageAt: Date | null;
  // The other participant: only what the viewer may see.
  other: { id: string; name: string; imageUrl: string | null };
};

// The signed-in student's or mentor's chats, most recently active first.
export async function listMyChats(): Promise<ActionResult<MyChat[]>> {
  const viewer = await getViewer();
  if (viewer.status !== "student" && viewer.status !== "mentor") {
    return { success: false, message: "Unauthorized" };
  }
  const isStudent = viewer.status === "student";

  const rows = isStudent
    ? await db
        .select({
          id: chats.id,
          status: chats.status,
          lastMessageAt: chats.lastMessageAt,
          other: {
            id: user.id,
            name: user.name,
            imageUrl: mentorProfile.imageUrl,
          },
        })
        .from(chats)
        .innerJoin(mentorProfile, eq(mentorProfile.userId, chats.mentorId))
        .innerJoin(user, eq(user.id, chats.mentorId))
        .where(eq(chats.studentId, viewer.user.id))
        .orderBy(sql`${chats.lastMessageAt} desc nulls last`, desc(chats.id))
    : await db
        .select({
          id: chats.id,
          status: chats.status,
          lastMessageAt: chats.lastMessageAt,
          other: {
            id: user.id,
            name: user.name,
            imageUrl: studentProfile.imageUrl,
          },
        })
        .from(chats)
        .innerJoin(studentProfile, eq(studentProfile.userId, chats.studentId))
        .innerJoin(user, eq(user.id, chats.studentId))
        .where(eq(chats.mentorId, viewer.user.id))
        .orderBy(sql`${chats.lastMessageAt} desc nulls last`, desc(chats.id));

  return { success: true, data: rows };
}
