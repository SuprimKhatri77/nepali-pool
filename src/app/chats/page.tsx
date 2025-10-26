import React from "react";
import { auth } from "../../../server/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "../../../lib/db";
import {
  chatSubscription,
  mentorProfile,
  studentProfile,
  user,
} from "../../../lib/db/schema";
import { and, eq } from "drizzle-orm";
import SelectChatPlaceholder from "@/components/SelectChatPlaceholder";

const Page = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return redirect("/login?toast=Please+log+in+to+continue");
  }
  const [userRecord] = await db
    .select()
    .from(user)
    .where(eq(user.id, session.user.id));
  if (!userRecord) {
    await auth.api.signOut({ headers: await headers() });
    return redirect("/login?toast=Please+login+to+continue");
  }
  if (!userRecord.emailVerified) return redirect("/verify-email?toast=Please+verify+your+email+first");

  if (!userRecord.role || userRecord.role === "none")
    return redirect("/select-role");
  if (userRecord.role === "admin") redirect("/admin/dashboard");

  if (userRecord.role === "student") {
    const [studentRecord] = await db
      .select()
      .from(studentProfile)
      .where(eq(studentProfile.userId, userRecord.id));
    if (!studentRecord) return redirect("/onboarding/student?toast=Please+complete+your+onboarding+to+continue");
    const subscriptionRecords = await db.query.chatSubscription.findMany({
      where: (fields, { eq }) =>
        // and(
        eq(chatSubscription.studentId, studentRecord.userId),
      // eq(chatSubscription.status, "active")
      // ),
    });

    if (subscriptionRecords.length === 0) {
      return (
        <div className="min-h-screen w-full flex flex-col justify-center items-center">
          <h1>
            You haven&apos;t purchased a chat pack yet, Considering purchasing
            one.
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
    if (!mentorRecord) return redirect("/onboarding/mentor?toast=Please+complete+your+onboarding+to+continue");
    if (mentorRecord.verifiedStatus === "rejected")
      return redirect("/rejected?toast=Your+mentor+profile+was+rejected");
    if (mentorRecord.verifiedStatus === "pending") return redirect("/waitlist?toast=Your+mentor+profile+is+under+review");
    const subscriptionRecords = await db.query.chatSubscription.findMany({
      where: (fields, { eq }) =>
        and(
          eq(chatSubscription.mentorId, mentorRecord.userId),
          eq(chatSubscription.status, "active")
        ),
    });

    if (subscriptionRecords.length === 0) {
      return (
        <div className="min-h-screen w-full flex flex-col justify-center items-center">
          <h1>No student has purchased your chat pack yet.</h1>
        </div>
      );
    }

    return <SelectChatPlaceholder />;
  }

  return redirect("/");
};

export default Page;
