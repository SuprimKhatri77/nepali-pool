"use server";

import { headers } from "next/headers";
import { auth } from "../lib/auth/auth";
import { redirect } from "next/navigation";
import { db } from "../../lib/db";
import {
  chats,
  chatSubscription,
  mentorProfile,
  studentProfile,
} from "../../lib/db/schema";
import { and, eq, or } from "drizzle-orm";

export async function getUserChats() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) return redirect("/login");

  const userId = session.user.id;

  try {
    const userStudentProfile = await db.query.studentProfile.findFirst({
      where: (fields, { eq }) => eq(studentProfile.userId, userId),
    });
    const userMentorProfile = await db.query.mentorProfile.findFirst({
      where: (fields, { eq }) => eq(mentorProfile.userId, userId),
    });
    const whereConditions: any = [];

    if (userStudentProfile) {
      whereConditions.push(eq(chats.studentId, userStudentProfile?.userId));
    }
    if (userMentorProfile) {
      whereConditions.push(eq(chats.mentorId, userMentorProfile?.userId));
    }
    if (whereConditions.length === 0) {
      return [];
    }

    // console.log("Where condition: ", whereConditions[0]);
    const chatsRecords = await db.query.chats.findMany({
      where: (fields, { eq }) =>
        and(or(...whereConditions), eq(chats.status, "active")),
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

    return chatsRecords ?? [];
  } catch (error) {
    console.error("Error: ", error);
    return [];
  }
}
