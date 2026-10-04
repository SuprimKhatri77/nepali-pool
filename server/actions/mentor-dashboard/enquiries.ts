"use server";

import { and, count, desc, eq, getTableColumns } from "drizzle-orm";
import { z } from "zod";
import { db } from "../../../lib/db";
import {
  chats,
  mentorEnquiry,
  mentorEnquiryStatusEnum,
  type MentorEnquirySelectType,
  type MentorEnquiryStatus,
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

export type EnquiryFilter = MentorEnquiryStatus | "all";

// Contact details are null until the mentor accepts (redacted server-side).
export type MentorEnquiryRow = Omit<
  MentorEnquirySelectType,
  "email" | "whatsappNumber"
> & {
  email: string | null;
  whatsappNumber: string | null;
  chatId: string | null;
};

const listInput = z.object({
  status: z.enum([...mentorEnquiryStatusEnum.enumValues, "all"]),
  cursor: z.string().max(100).nullable(),
});

export async function listMentorEnquiries(input: {
  status: EnquiryFilter;
  cursor: string | null;
}): Promise<ActionResult<CursorPage<MentorEnquiryRow>>> {
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
      enquiry: getTableColumns(mentorEnquiry),
      chatId: chats.id,
      cursorTs: cursorTimestamp(mentorEnquiry.createdAt),
    })
    .from(mentorEnquiry)
    .leftJoin(
      chats,
      and(
        eq(chats.studentId, mentorEnquiry.studentId),
        eq(chats.mentorId, mentorEnquiry.mentorId),
      ),
    )
    .where(
      and(
        eq(mentorEnquiry.mentorId, mentorId),
        status === "all" ? undefined : eq(mentorEnquiry.status, status),
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
      (row) => row.enquiry.id,
      ({ enquiry, chatId }) => {
        // Contact details only leave the server once the mentor has accepted;
        // hiding them in the UI alone would still ship them to the browser.
        const accepted = enquiry.status === "accepted";
        return {
          ...enquiry,
          email: accepted ? enquiry.email : null,
          whatsappNumber: accepted ? enquiry.whatsappNumber : null,
          chatId,
        };
      },
    ),
  };
}

// Count per status, for the filter chips.
export async function getMentorEnquiryCounts(): Promise<
  ActionResult<Partial<Record<MentorEnquiryStatus, number>>>
> {
  const current = await getCurrentMentor();
  if (!current.success) return current;

  const rows = await db
    .select({ status: mentorEnquiry.status, total: count() })
    .from(mentorEnquiry)
    .where(eq(mentorEnquiry.mentorId, current.mentorRecord.userId))
    .groupBy(mentorEnquiry.status);

  return {
    success: true,
    data: Object.fromEntries(rows.map((row) => [row.status, row.total])),
  };
}
