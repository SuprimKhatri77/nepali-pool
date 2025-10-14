"use server";

import { db } from "../../lib/db";
import {
  chats,
  ChatsSelectType,
  mentorProfile,
  MentorProfileSelectType,
  studentProfile,
  StudentProfileSelectType,
  UserSelectType,
} from "../../lib/db/schema";
import { eq } from "drizzle-orm";
import { getCurrentUser } from "../lib/auth/helpers/getCurrentUser";

type UserChatType =
  | {
      success: true;
      chatsRecords: (ChatsSelectType & {
        studentProfile: StudentProfileSelectType & {
          user: UserSelectType;
        };
        mentorProfile: MentorProfileSelectType & {
          user: UserSelectType;
        };
      })[];
    }
  | { success: false; message: string; chatsRecords: [] };

export async function getUserChats(): Promise<UserChatType> {
  const result = await getCurrentUser();
  if (!result.success) {
    return { success: false, message: result.message, chatsRecords: [] };
  }

  const currentUser = result.userRecord;

  try {
    const userStudentProfile = await db.query.studentProfile.findFirst({
      where: (fields, { eq }) => eq(studentProfile.userId, currentUser.id),
    });
    const userMentorProfile = await db.query.mentorProfile.findFirst({
      where: (fields, { eq }) => eq(mentorProfile.userId, currentUser.id),
    });
    const whereConditions: any = [];

    if (userStudentProfile) {
      whereConditions.push(eq(chats.studentId, userStudentProfile?.userId));
    }
    if (userMentorProfile) {
      whereConditions.push(eq(chats.mentorId, userMentorProfile?.userId));
    }
    if (whereConditions.length === 0) {
      return { success: false, message: "", chatsRecords: [] };
    }

    // console.log("Where condition: ", whereConditions[0]);
    const chatsRecords = await db.query.chats.findMany({
      where: (fields, { eq }) => whereConditions[0],
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
    });

    // console.log("Chats found:", chatsRecords.length);
    // console.log(
    //   "First chat with student profile:",
    //   chatsRecords[0].studentProfile
    // );

    return { success: true, chatsRecords: chatsRecords ?? [] };
  } catch (error) {
    console.error("Error: ", error);
    return {
      success: false,
      message: "Something went wrong",
      chatsRecords: [],
    };
  }
}
