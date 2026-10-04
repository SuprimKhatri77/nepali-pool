import "server-only";

import { cache } from "react";
import { and, count, eq, inArray, min } from "drizzle-orm";
import { db } from "../../../lib/db";
import { mentorService } from "../../../lib/db/schema";

// The only mentor fields that may reach a public page or a client component.
// Private fields (ID card scan, phone number, zip code, account email) are
// left out on purpose; select with these instead of loading whole rows.
export const publicMentorColumns = {
  userId: true,
  bio: true,
  country: true,
  city: true,
  nationality: true,
  sex: true,
  imageUrl: true,
  verifiedStatus: true,
  createdAt: true,
} as const;

export const publicMentorUserColumns = {
  name: true,
  image: true,
} as const;

export const publicMentorWith = {
  user: { columns: publicMentorUserColumns },
} as const;

// An approved mentor's public profile, or null. Cached per request so the
// page and generateMetadata share one query.
export const getPublicMentor = cache(async (mentorId: string) => {
  const mentor = await db.query.mentorProfile.findFirst({
    columns: publicMentorColumns,
    with: publicMentorWith,
    where: (fields, { and, eq }) =>
      and(eq(fields.userId, mentorId), eq(fields.verifiedStatus, "accepted")),
  });
  return mentor ?? null;
});

export type ServiceSummary = { count: number; fromPriceNpr: number };

// Active service count and lowest price per mentor, in one grouped query.
export async function getServiceSummaries(
  mentorIds: string[],
): Promise<Map<string, ServiceSummary>> {
  if (mentorIds.length === 0) return new Map();
  const rows = await db
    .select({
      mentorId: mentorService.mentorId,
      count: count(),
      fromPriceNpr: min(mentorService.priceNpr),
    })
    .from(mentorService)
    .where(
      and(
        inArray(mentorService.mentorId, mentorIds),
        eq(mentorService.isActive, true),
      ),
    )
    .groupBy(mentorService.mentorId);
  return new Map(
    rows.map((row) => [
      row.mentorId,
      { count: row.count, fromPriceNpr: row.fromPriceNpr ?? 0 },
    ]),
  );
}

// Subquery of mentors with at least one active service, for filtering.
export const mentorsOfferingServices = db
  .selectDistinct({ mentorId: mentorService.mentorId })
  .from(mentorService)
  .where(eq(mentorService.isActive, true));
