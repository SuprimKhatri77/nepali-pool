import React from "react";
import { auth } from "../../../server/lib/auth/auth";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { db } from "../../../lib/db";
import {
  chatSubscription,
  mentorProfile,
  studentProfile,
  user,
} from "../../../lib/db/schema";
import { and, eq } from "drizzle-orm";
import SelectChatPlaceholder from "@/components/SelectChatPlaceholder";
import { redirectWithMessage } from "../../../server/lib/auth/helpers/redirect-with-message";

const Page = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return redirectWithMessage("/login", "Please login to continue.");
  }
  const [userRecord] = await db
    .select()
    .from(user)
    .where(eq(user.id, session.user.id));
  if (!userRecord) {
    await auth.api.signOut({ headers: await headers() });
    return redirectWithMessage("/login", "Please login to continue.");
  }
  if (!userRecord.emailVerified)
    return redirectWithMessage(
      "/verify-email",
      "Please verify your email to continue."
    );

  if (!userRecord.role || userRecord.role === "none")
    return redirect("/select-role");
  if (userRecord.role === "admin") redirect("/admin/dashboard");

  if (userRecord.role === "student") {
    const [studentRecord] = await db
      .select()
      .from(studentProfile)
      .where(eq(studentProfile.userId, userRecord.id));
    if (!studentRecord)
      return redirectWithMessage(
        "/onboarding/student",
        "Please complete the onboarding to conitnue"
      );
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
    if (!mentorRecord)
      return redirectWithMessage(
        "/onboarding/mentor",
        "Please complete the onboarding to continue."
      );
    if (mentorRecord.verifiedStatus === "rejected")
      return redirectWithMessage("/rejected", "You are not a verified mentor.");
    if (mentorRecord.verifiedStatus === "pending")
      return redirectWithMessage(
        "/waitlist",
        "Please wait until you're verified."
      );
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

  return notFound();
};

export default Page;
