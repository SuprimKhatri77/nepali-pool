"use server";

import { asc, count, desc, eq, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { z } from "zod";
import { db } from "../../../lib/db";
import {
  meetingSession,
  user,
  videoCall,
  videoCallStatusEnum,
} from "../../../lib/db/schema";
import type { ActionResult, OffsetPage } from "../../../src/utils/action-result";
import { getCurrentAdmin } from "../../lib/auth/guards";
import {
  TABLE_PAGE_SIZE,
  clampPage,
  searchColumns,
} from "../../lib/pagination/offset";

type VideoCallStatus = (typeof videoCallStatusEnum.enumValues)[number];
export type AdminVideoCallFilter = VideoCallStatus | "all";

export type AdminVideoCallRow = {
  id: string;
  status: VideoCallStatus | null;
  requestedAt: Date | null;
  scheduledTime: Date | null;
  student: { id: string; name: string; email: string };
  mentor: { id: string; name: string; email: string };
};

export type AdminSessionRow = {
  id: string;
  name: string;
  email: string;
  city: string;
  question: string | null;
  registeredAt: Date | null;
};

const pageInput = z.number().int().min(1).max(Number.MAX_SAFE_INTEGER);

const studentUser = alias(user, "student_user");
const mentorUser = alias(user, "mentor_user");

const videoCallListInput = z.object({
  status: z.enum([...videoCallStatusEnum.enumValues, "all"]),
  page: pageInput,
});

// Video-call requests (paid packs) with both participants, newest first.
export async function listAdminVideoCalls(input: {
  status: AdminVideoCallFilter;
  page: number;
}): Promise<ActionResult<OffsetPage<AdminVideoCallRow>>> {
  const parsed = videoCallListInput.safeParse(input);
  if (!parsed.success) return { success: false, message: "Invalid request" };
  const { status } = parsed.data;

  const current = await getCurrentAdmin();
  if (!current.success) return current;

  const where = status === "all" ? undefined : eq(videoCall.status, status);

  const [{ total }] = await db
    .select({ total: count() })
    .from(videoCall)
    .where(where);
  const { page, pageCount, offset } = clampPage(parsed.data.page, total);

  const items = await db
    .select({
      id: videoCall.id,
      status: videoCall.status,
      requestedAt: videoCall.createdAt,
      scheduledTime: videoCall.scheduledTime,
      student: {
        id: studentUser.id,
        name: studentUser.name,
        email: studentUser.email,
      },
      mentor: {
        id: mentorUser.id,
        name: mentorUser.name,
        email: mentorUser.email,
      },
    })
    .from(videoCall)
    .innerJoin(studentUser, eq(studentUser.id, videoCall.studentId))
    .innerJoin(mentorUser, eq(mentorUser.id, videoCall.mentorId))
    .where(where)
    .orderBy(sql`${videoCall.createdAt} desc nulls last`, desc(videoCall.id))
    .limit(TABLE_PAGE_SIZE)
    .offset(offset);

  return {
    success: true,
    data: { items, total, page, pageCount, pageSize: TABLE_PAGE_SIZE },
  };
}

// Requests per status for the filter tabs ("all" counted, not summed:
// `status` is nullable).
export async function getAdminVideoCallCounts(): Promise<
  ActionResult<Partial<Record<AdminVideoCallFilter, number>>>
> {
  const current = await getCurrentAdmin();
  if (!current.success) return current;

  const rows = await db
    .select({ status: videoCall.status, total: count() })
    .from(videoCall)
    .groupBy(videoCall.status);

  return {
    success: true,
    data: {
      ...Object.fromEntries(
        rows.flatMap((row) =>
          row.status ? [[row.status, row.total] as const] : [],
        ),
      ),
      all: rows.reduce((sum, row) => sum + row.total, 0),
    },
  };
}

const sessionListInput = z.object({
  q: z.string().trim().max(100),
  page: pageInput,
});

// People registered for the group session, newest first.
export async function listAdminSessions(input: {
  q: string;
  page: number;
}): Promise<ActionResult<OffsetPage<AdminSessionRow>>> {
  const parsed = sessionListInput.safeParse(input);
  if (!parsed.success) return { success: false, message: "Invalid request" };

  const current = await getCurrentAdmin();
  if (!current.success) return current;

  const where = searchColumns(parsed.data.q, [
    meetingSession.name,
    meetingSession.email,
    meetingSession.city,
  ]);

  const [{ total }] = await db
    .select({ total: count() })
    .from(meetingSession)
    .where(where);
  const { page, pageCount, offset } = clampPage(parsed.data.page, total);

  const items = await db
    .select({
      id: meetingSession.id,
      name: meetingSession.name,
      email: meetingSession.email,
      city: meetingSession.city,
      question: meetingSession.question,
      registeredAt: meetingSession.createdAt,
    })
    .from(meetingSession)
    .where(where)
    .orderBy(
      sql`${meetingSession.createdAt} desc nulls last`,
      asc(meetingSession.id),
    )
    .limit(TABLE_PAGE_SIZE)
    .offset(offset);

  return {
    success: true,
    data: { items, total, page, pageCount, pageSize: TABLE_PAGE_SIZE },
  };
}
