"use server";

import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "../../../lib/db";
import {
  chats,
  mentorEnquiry,
  serviceBooking,
  user,
  type MentorEnquirySelectType,
  type ServiceBookingSelectType,
} from "../../../lib/db/schema";
import type { ActionResult, CursorPage } from "../../../src/utils/action-result";
import { getCurrentStudent } from "../../lib/auth/guards";
import {
  PAGE_SIZE,
  afterCursor,
  cursorTimestamp,
  parseCursor,
  toCursorPage,
} from "../../lib/pagination/keyset";

// Only what the student's cards show; the contact details and payment proof
// they submitted stay on the mentor side.
export type StudentBookingRow = Pick<
  ServiceBookingSelectType,
  | "id"
  | "referenceCode"
  | "mentorId"
  | "serviceTitle"
  | "priceNpr"
  | "status"
  | "rejectionReason"
  | "createdAt"
> & { mentorName: string; chatId: string | null };

export type StudentEnquiryRow = Pick<
  MentorEnquirySelectType,
  | "id"
  | "referenceCode"
  | "mentorId"
  | "question"
  | "status"
  | "mentorNote"
  | "createdAt"
> & { mentorName: string; chatId: string | null };

const listInput = z.object({ cursor: z.string().max(100).nullable() });

export async function listStudentBookings(input: {
  cursor: string | null;
}): Promise<ActionResult<CursorPage<StudentBookingRow>>> {
  const parsed = listInput.safeParse(input);
  if (!parsed.success) return { success: false, message: "Invalid request" };
  const cursor = parseCursor(parsed.data.cursor);
  if (cursor === "invalid") return { success: false, message: "Invalid page" };

  const current = await getCurrentStudent();
  if (!current.success) return current;
  const studentId = current.studentRecord.userId;

  const rows = await db
    .select({
      item: {
        id: serviceBooking.id,
        referenceCode: serviceBooking.referenceCode,
        mentorId: serviceBooking.mentorId,
        serviceTitle: serviceBooking.serviceTitle,
        priceNpr: serviceBooking.priceNpr,
        status: serviceBooking.status,
        rejectionReason: serviceBooking.rejectionReason,
        createdAt: serviceBooking.createdAt,
        mentorName: user.name,
        chatId: chats.id,
      },
      cursorTs: cursorTimestamp(serviceBooking.createdAt),
    })
    .from(serviceBooking)
    .innerJoin(user, eq(user.id, serviceBooking.mentorId))
    .leftJoin(
      chats,
      and(
        eq(chats.studentId, serviceBooking.studentId),
        eq(chats.mentorId, serviceBooking.mentorId),
      ),
    )
    .where(
      and(
        eq(serviceBooking.studentId, studentId),
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
      (row) => row.item.id,
      (row) => row.item,
    ),
  };
}

export async function listStudentEnquiries(input: {
  cursor: string | null;
}): Promise<ActionResult<CursorPage<StudentEnquiryRow>>> {
  const parsed = listInput.safeParse(input);
  if (!parsed.success) return { success: false, message: "Invalid request" };
  const cursor = parseCursor(parsed.data.cursor);
  if (cursor === "invalid") return { success: false, message: "Invalid page" };

  const current = await getCurrentStudent();
  if (!current.success) return current;
  const studentId = current.studentRecord.userId;

  const rows = await db
    .select({
      item: {
        id: mentorEnquiry.id,
        referenceCode: mentorEnquiry.referenceCode,
        mentorId: mentorEnquiry.mentorId,
        question: mentorEnquiry.question,
        status: mentorEnquiry.status,
        mentorNote: mentorEnquiry.mentorNote,
        createdAt: mentorEnquiry.createdAt,
        mentorName: user.name,
        chatId: chats.id,
      },
      cursorTs: cursorTimestamp(mentorEnquiry.createdAt),
    })
    .from(mentorEnquiry)
    .innerJoin(user, eq(user.id, mentorEnquiry.mentorId))
    .leftJoin(
      chats,
      and(
        eq(chats.studentId, mentorEnquiry.studentId),
        eq(chats.mentorId, mentorEnquiry.mentorId),
      ),
    )
    .where(
      and(
        eq(mentorEnquiry.studentId, studentId),
        cursor
          ? afterCursor(mentorEnquiry.createdAt, mentorEnquiry.id, cursor)
          : undefined,
      ),
    )
    .orderBy(desc(mentorEnquiry.createdAt), desc(mentorEnquiry.id))
    .limit(PAGE_SIZE + 1);

  return {
    success: true,
    data: toCursorPage(
      rows,
      (row) => row.item.id,
      (row) => row.item,
    ),
  };
}
