"use server";

import { and, count, eq, gte, min, sql } from "drizzle-orm";
import { union } from "drizzle-orm/pg-core";
import { startOfWeek } from "date-fns";
import { db } from "../../../lib/db";
import {
  chats,
  mentorEnquiry,
  mentorService,
  serviceBooking,
  videoCall,
} from "../../../lib/db/schema";
import type { ActionResult } from "../../../src/utils/action-result";
import { getCurrentMentor } from "../../lib/auth/guards";
import {
  getMentorAttentionCounts,
  type MentorAttentionCounts,
} from "../../lib/mentor-dashboard/attention-counts";

export type MentorDashboardOverview = MentorAttentionCounts & {
  activeChats: number;
  newChatsThisWeek: number;
  upcomingCalls: number;
  nextCallAt: Date | null;
  totalStudents: number;
  activeServices: number;
};

// Everything the mentor overview page shows, in one round trip. Server
// actions run one at a time per client, so the page uses this single
// fetcher instead of one per card.
export async function getMentorDashboardOverview(): Promise<
  ActionResult<MentorDashboardOverview>
> {
  const current = await getCurrentMentor();
  if (!current.success) return current;
  const mentorId = current.mentorRecord.userId;

  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const isUpcoming = and(
    eq(videoCall.status, "scheduled"),
    gte(videoCall.scheduledTime, now),
  );

  // Anyone who has chatted, booked a call or service, or asked a question.
  const students = union(
    db
      .select({ studentId: chats.studentId })
      .from(chats)
      .where(eq(chats.mentorId, mentorId)),
    db
      .select({ studentId: videoCall.studentId })
      .from(videoCall)
      .where(eq(videoCall.mentorId, mentorId)),
    db
      .select({ studentId: serviceBooking.studentId })
      .from(serviceBooking)
      .where(eq(serviceBooking.mentorId, mentorId)),
    db
      .select({ studentId: mentorEnquiry.studentId })
      .from(mentorEnquiry)
      .where(eq(mentorEnquiry.mentorId, mentorId)),
  ).as("students");

  const [[chatStats], [callStats], [studentStats], [services], attention] =
    await Promise.all([
      db
        .select({
          active: sql<number>`count(*) filter (where ${eq(chats.status, "active")})`.mapWith(Number),
          newThisWeek: sql<number>`count(*) filter (where ${gte(chats.createdAt, weekStart)})`.mapWith(Number),
        })
        .from(chats)
        .where(eq(chats.mentorId, mentorId)),
      db
        .select({ upcoming: count(), next: min(videoCall.scheduledTime) })
        .from(videoCall)
        .where(and(eq(videoCall.mentorId, mentorId), isUpcoming)),
      db.select({ total: count() }).from(students),
      db
        .select({ active: count() })
        .from(mentorService)
        .where(
          and(
            eq(mentorService.mentorId, mentorId),
            eq(mentorService.isActive, true),
          ),
        ),
      getMentorAttentionCounts(mentorId),
    ]);

  return {
    success: true,
    data: {
      ...attention,
      activeChats: chatStats.active,
      newChatsThisWeek: chatStats.newThisWeek,
      upcomingCalls: callStats.upcoming,
      nextCallAt: callStats.next,
      totalStudents: studentStats.total,
      activeServices: services.active,
    },
  };
}
