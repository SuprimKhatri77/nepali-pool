"use server";

import { and, count, desc, eq, getTableColumns } from "drizzle-orm";
import { z } from "zod";
import { db } from "../../../lib/db";
import {
  chats,
  serviceBooking,
  serviceBookingStatusEnum,
  type ServiceBookingSelectType,
  type ServiceBookingStatus,
} from "../../../lib/db/schema";
import type { ActionResult, CursorPage } from "../../../src/utils/action-result";
import { getCurrentMentor } from "../../lib/auth/guards";
import {
  PAGE_SIZE,
  afterCursor,
  cursorTimestamp,
  parseCursor,
  toCursorPage,
} from "../../lib/pagination/keyset";

export type BookingFilter = ServiceBookingStatus | "all";

// The in-app chat with that student, if there is one (created on confirm).
export type MentorBookingRow = ServiceBookingSelectType & {
  chatId: string | null;
};

const listInput = z.object({
  status: z.enum([...serviceBookingStatusEnum.enumValues, "all"]),
  cursor: z.string().max(100).nullable(),
});

export async function listMentorBookings(input: {
  status: BookingFilter;
  cursor: string | null;
}): Promise<ActionResult<CursorPage<MentorBookingRow>>> {
  const parsed = listInput.safeParse(input);
  if (!parsed.success) return { success: false, message: "Invalid request" };
  const cursor = parseCursor(parsed.data.cursor);
  if (cursor === "invalid") return { success: false, message: "Invalid page" };
  const { status } = parsed.data;

  const current = await getCurrentMentor();
  if (!current.success) return current;
  const mentorId = current.mentorRecord.userId;

  const rows = await db
    .select({
      booking: getTableColumns(serviceBooking),
      chatId: chats.id,
      cursorTs: cursorTimestamp(serviceBooking.createdAt),
    })
    .from(serviceBooking)
    .leftJoin(
      chats,
      and(
        eq(chats.studentId, serviceBooking.studentId),
        eq(chats.mentorId, serviceBooking.mentorId),
      ),
    )
    .where(
      and(
        eq(serviceBooking.mentorId, mentorId),
        status === "all" ? undefined : eq(serviceBooking.status, status),
        cursor
          ? afterCursor(serviceBooking.createdAt, serviceBooking.id, cursor)
          : undefined,
      ),
    )
    .orderBy(desc(serviceBooking.createdAt), desc(serviceBooking.id))
    .limit(PAGE_SIZE + 1);

  return {
    success: true,
    data: toCursorPage(
      rows,
      (row) => row.booking.id,
      (row) => ({ ...row.booking, chatId: row.chatId }),
    ),
  };
}

// Count per status, for the filter chips.
export async function getMentorBookingCounts(): Promise<
  ActionResult<Partial<Record<ServiceBookingStatus, number>>>
> {
  const current = await getCurrentMentor();
  if (!current.success) return current;

  const rows = await db
    .select({ status: serviceBooking.status, total: count() })
    .from(serviceBooking)
    .where(eq(serviceBooking.mentorId, current.mentorRecord.userId))
    .groupBy(serviceBooking.status);

  return {
    success: true,
    data: Object.fromEntries(rows.map((row) => [row.status, row.total])),
  };
}
