"use server";

import { and, asc, count, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "../../../lib/db";
import {
  mentorProfile,
  mentorVerifiedStatusEnum,
  studentProfile,
  user,
} from "../../../lib/db/schema";
import type { ActionResult, OffsetPage } from "../../../src/utils/action-result";
import { getCurrentAdmin } from "../../lib/auth/guards";
import {
  TABLE_PAGE_SIZE,
  clampPage,
  searchColumns,
} from "../../lib/pagination/offset";

type MentorStatus = (typeof mentorVerifiedStatusEnum.enumValues)[number];
export type AdminMentorFilter = MentorStatus | "all";

export type AdminMentorRow = {
  userId: string;
  name: string;
  email: string;
  imageUrl: string | null;
  city: string | null;
  country: string | null;
  verifiedStatus: MentorStatus | null;
  appliedAt: Date | null;
};

export type AdminStudentRow = {
  userId: string;
  name: string;
  email: string;
  imageUrl: string | null;
  city: string | null;
  district: string | null;
  favoriteDestination: string[] | null;
  joinedAt: Date | null;
};

const searchInput = z.string().trim().max(100);
const pageInput = z.number().int().min(1).max(Number.MAX_SAFE_INTEGER);

const mentorListInput = z.object({
  status: z.enum([...mentorVerifiedStatusEnum.enumValues, "all"]),
  q: searchInput,
  page: pageInput,
});

export async function listAdminMentors(input: {
  status: AdminMentorFilter;
  q: string;
  page: number;
}): Promise<ActionResult<OffsetPage<AdminMentorRow>>> {
  const parsed = mentorListInput.safeParse(input);
  if (!parsed.success) return { success: false, message: "Invalid request" };
  const { status, q } = parsed.data;

  const current = await getCurrentAdmin();
  if (!current.success) return current;

  const where = and(
    status === "all" ? undefined : eq(mentorProfile.verifiedStatus, status),
    searchColumns(q, [
      user.name,
      user.email,
      mentorProfile.city,
      mentorProfile.country,
    ]),
  );

  const [{ total }] = await db
    .select({ total: count() })
    .from(mentorProfile)
    .innerJoin(user, eq(user.id, mentorProfile.userId))
    .where(where);
  const { page, pageCount, offset } = clampPage(parsed.data.page, total);

  const items = await db
    .select({
      userId: mentorProfile.userId,
      name: user.name,
      email: user.email,
      imageUrl: mentorProfile.imageUrl,
      city: mentorProfile.city,
      country: mentorProfile.country,
      verifiedStatus: mentorProfile.verifiedStatus,
      appliedAt: mentorProfile.createdAt,
    })
    .from(mentorProfile)
    .innerJoin(user, eq(user.id, mentorProfile.userId))
    .where(where)
    .orderBy(
      sql`${mentorProfile.createdAt} desc nulls last`,
      asc(mentorProfile.userId),
    )
    .limit(TABLE_PAGE_SIZE)
    .offset(offset);

  return {
    success: true,
    data: { items, total, page, pageCount, pageSize: TABLE_PAGE_SIZE },
  };
}

// Mentor profiles per verification status, for the filter tabs. "all" is
// counted rather than summed: `verified_status` is nullable, and the "all"
// list includes those rows.
export async function getAdminMentorCounts(): Promise<
  ActionResult<Partial<Record<AdminMentorFilter, number>>>
> {
  const current = await getCurrentAdmin();
  if (!current.success) return current;

  const rows = await db
    .select({ status: mentorProfile.verifiedStatus, total: count() })
    .from(mentorProfile)
    .groupBy(mentorProfile.verifiedStatus);

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

const studentListInput = z.object({ q: searchInput, page: pageInput });

export async function listAdminStudents(input: {
  q: string;
  page: number;
}): Promise<ActionResult<OffsetPage<AdminStudentRow>>> {
  const parsed = studentListInput.safeParse(input);
  if (!parsed.success) return { success: false, message: "Invalid request" };

  const current = await getCurrentAdmin();
  if (!current.success) return current;

  const where = searchColumns(parsed.data.q, [
    user.name,
    user.email,
    studentProfile.city,
    studentProfile.district,
  ]);

  const [{ total }] = await db
    .select({ total: count() })
    .from(studentProfile)
    .innerJoin(user, eq(user.id, studentProfile.userId))
    .where(where);
  const { page, pageCount, offset } = clampPage(parsed.data.page, total);

  const items = await db
    .select({
      userId: studentProfile.userId,
      name: user.name,
      email: user.email,
      imageUrl: studentProfile.imageUrl,
      city: studentProfile.city,
      district: studentProfile.district,
      favoriteDestination: studentProfile.favoriteDestination,
      joinedAt: studentProfile.createdAt,
    })
    .from(studentProfile)
    .innerJoin(user, eq(user.id, studentProfile.userId))
    .where(where)
    .orderBy(
      sql`${studentProfile.createdAt} desc nulls last`,
      asc(studentProfile.userId),
    )
    .limit(TABLE_PAGE_SIZE)
    .offset(offset);

  return {
    success: true,
    data: { items, total, page, pageCount, pageSize: TABLE_PAGE_SIZE },
  };
}
