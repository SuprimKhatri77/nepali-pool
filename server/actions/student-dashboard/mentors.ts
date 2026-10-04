"use server";

import { and, asc, eq, inArray, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "../../../lib/db";
import { favorite, mentorProfile } from "../../../lib/db/schema";
import type { PublicMentor } from "../../../types/all-types";
import type { ActionResult } from "../../../src/utils/action-result";
import { getCurrentStudent } from "../../lib/auth/guards";
import {
  publicMentorColumns,
  publicMentorWith,
} from "../../lib/mentors/public-mentor";

export type StudentMentorCard = PublicMentor & { isFavorite: boolean };

export type MatchingMentorsPage = {
  items: StudentMentorCard[];
  nextPage: number | null;
};

const MATCHING_PAGE_SIZE = 12;
// Offsets past this aren't a real browsing session.
const MAX_PAGE = 500;

// Approved mentors in the student's destination countries, a page at a time.
// Offset pages over a fixed total order (newest first, then id): mentor
// `createdAt` is nullable, which rules out a keyset cursor, and this is a
// browse list where the client drops the odd duplicate if a mentor is
// approved mid-scroll.
export async function listMatchingMentors(input: {
  page: number;
}): Promise<ActionResult<MatchingMentorsPage>> {
  const parsed = z
    .object({ page: z.number().int().min(0).max(MAX_PAGE) })
    .safeParse(input);
  if (!parsed.success) return { success: false, message: "Invalid page" };
  const { page } = parsed.data;

  const current = await getCurrentStudent();
  if (!current.success) return current;
  const { studentRecord } = current;
  const destinations = studentRecord.favoriteDestination ?? [];
  if (destinations.length === 0) {
    return { success: true, data: { items: [], nextPage: null } };
  }

  const rows = await db.query.mentorProfile.findMany({
    columns: publicMentorColumns,
    with: publicMentorWith,
    where: and(
      eq(mentorProfile.verifiedStatus, "accepted"),
      inArray(mentorProfile.country, destinations),
    ),
    orderBy: [
      sql`${mentorProfile.createdAt} desc nulls last`,
      asc(mentorProfile.userId),
    ],
    limit: MATCHING_PAGE_SIZE + 1,
    offset: page * MATCHING_PAGE_SIZE,
  });
  const pageRows = rows.slice(0, MATCHING_PAGE_SIZE);

  return {
    success: true,
    data: {
      items: await withFavoriteFlags(studentRecord.userId, pageRows),
      nextPage: rows.length > MATCHING_PAGE_SIZE ? page + 1 : null,
    },
  };
}

// The student's favorite mentors (approved ones only), most recent first.
export async function listFavoriteMentors(): Promise<
  ActionResult<StudentMentorCard[]>
> {
  const current = await getCurrentStudent();
  if (!current.success) return current;
  const studentId = current.studentRecord.userId;

  const favorites = await db
    .select({ mentorId: favorite.mentorId })
    .from(favorite)
    .where(eq(favorite.studentId, studentId))
    .orderBy(sql`${favorite.createdAt} desc nulls last`);
  const mentorIds = favorites
    .map((row) => row.mentorId)
    .filter((id): id is string => id !== null);
  if (mentorIds.length === 0) return { success: true, data: [] };

  const mentors = await db.query.mentorProfile.findMany({
    columns: publicMentorColumns,
    with: publicMentorWith,
    where: and(
      eq(mentorProfile.verifiedStatus, "accepted"),
      inArray(mentorProfile.userId, mentorIds),
    ),
  });
  const byId = new Map(mentors.map((mentor) => [mentor.userId, mentor]));

  return {
    success: true,
    data: mentorIds.flatMap((id) => {
      const mentor = byId.get(id);
      return mentor ? [{ ...mentor, isFavorite: true }] : [];
    }),
  };
}

// Idempotent: setting the state it's already in is a success, so double
// clicks and two tabs can't produce errors or duplicates.
export async function setFavoriteMentor(input: {
  mentorId: string;
  favorite: boolean;
}): Promise<ActionResult<{ favorite: boolean }>> {
  const parsed = z
    .object({ mentorId: z.string().min(1).max(64), favorite: z.boolean() })
    .safeParse(input);
  if (!parsed.success) return { success: false, message: "Invalid request" };
  const { mentorId } = parsed.data;

  const current = await getCurrentStudent();
  if (!current.success) return current;
  const studentId = current.studentRecord.userId;

  if (!parsed.data.favorite) {
    await db
      .delete(favorite)
      .where(
        and(eq(favorite.studentId, studentId), eq(favorite.mentorId, mentorId)),
      );
    return { success: true, data: { favorite: false } };
  }

  const mentor = await db.query.mentorProfile.findFirst({
    columns: { userId: true },
    where: and(
      eq(mentorProfile.userId, mentorId),
      eq(mentorProfile.verifiedStatus, "accepted"),
    ),
  });
  if (!mentor) return { success: false, message: "Mentor not found" };

  await db
    .insert(favorite)
    .values({ studentId, mentorId })
    .onConflictDoNothing({ target: [favorite.studentId, favorite.mentorId] });
  return { success: true, data: { favorite: true } };
}

async function withFavoriteFlags(
  studentId: string,
  mentors: PublicMentor[],
): Promise<StudentMentorCard[]> {
  if (mentors.length === 0) return [];
  const rows = await db
    .select({ mentorId: favorite.mentorId })
    .from(favorite)
    .where(
      and(
        eq(favorite.studentId, studentId),
        inArray(
          favorite.mentorId,
          mentors.map((mentor) => mentor.userId),
        ),
      ),
    );
  const favorites = new Set(rows.map((row) => row.mentorId));
  return mentors.map((mentor) => ({
    ...mentor,
    isFavorite: favorites.has(mentor.userId),
  }));
}
