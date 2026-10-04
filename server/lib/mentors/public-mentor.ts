import "server-only";

import { cache } from "react";
import { db } from "../../../lib/db";

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
