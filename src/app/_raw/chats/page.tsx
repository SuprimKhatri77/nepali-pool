import React from "react";
import { auth } from "../../../../server/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "../../../../lib/db";
import {
  chatSubscription,
  mentorProfile,
  studentProfile,
  user,
} from "../../../../lib/db/schema";
import { and, eq } from "drizzle-orm";
import Chats from "@/components/Chats";
import SelectChatPlaceholder from "@/components/SelectChatPlaceholder";

const Page = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return redirect("/login");
  }
  const [userRecord] = await db
    .select()
    .from(user)
    .where(eq(user.id, session.user.id));
  if (!userRecord) return redirect("/sign-up");
  if (!userRecord.emailVerified) return redirect("/sign-up/verify-email");

  if (!userRecord.role || userRecord.role === "none")
    return redirect("/select-role");

  if (userRecord.role === "student") {
    const [studentRecord] = await db
      .select()
      .from(studentProfile)
      .where(eq(studentProfile.userId, userRecord.id));
    if (!studentRecord) return redirect("/sign-up/onboarding/student");
    const subscriptionRecords = await db.query.chatSubscription.findMany({
      where: (fields, { eq }) =>
        and(
          eq(chatSubscription.studentId, studentRecord.userId),
          eq(chatSubscription.status, "active")
        ),
    });

    if (subscriptionRecords.length === 0) {
      return (
        <div className="min-h-screen w-full flex flex-col justify-center items-center">
          <h1>
            You haven't purchased a chat pack yet, Considering purchasing one.
          </h1>
        </div>
      );
    }
    return <SelectChatPlaceholder />;
  }

  if (userRecord.role === "mentor") {
    const [mentorRecord] = await db
      .select()
      .from(mentorProfile)
      .where(eq(mentorProfile.userId, userRecord.id));
    if (!mentorRecord) return redirect("/sign-up/onboarding/mentor");
    if (mentorRecord.verifiedStatus === "pending") return redirect("/waitlist");
    if (mentorRecord.verifiedStatus === "rejected")
      return redirect("/rejected");
    return <SelectChatPlaceholder />;
  }

  return redirect("/select-role");
};

export default Page;
