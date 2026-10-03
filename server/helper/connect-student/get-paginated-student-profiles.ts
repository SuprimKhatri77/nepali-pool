"use server";

import { and, count, isNotNull, ne } from "drizzle-orm";
import { db } from "../../../lib/db";
import { connectStudentProfiles } from "../../../lib/db/schema";
import type { PublicConnectStudent } from "../../../types/all-types";

const MAX_PAGE_SIZE = 50;
const MAX_PAGE = 10_000;

// Public (no login needed): anyone can call this action with any arguments,
// so the page size is capped and only card fields leave the server.
export async function getPaginatedStudentProfiles(
  page: number = 0,
  limit: number,
): Promise<{
  students: PublicConnectStudent[];
  total: number;
}> {
  const safePage =
    Number.isInteger(page) && page > 0 ? Math.min(page, MAX_PAGE) : 0;
  const safeLimit =
    Number.isInteger(limit) && limit > 0 ? Math.min(limit, MAX_PAGE_SIZE) : 20;
  const offset = safePage * safeLimit;

  const studentProfiles = await db.query.connectStudentProfiles.findMany({
    where: (fields, { isNotNull, and, ne }) =>
      and(
        ne(fields.universityName, ""),
        isNotNull(fields.universityName),
        ne(fields.universityName, "Not set"),
      ),
    columns: { whatsAppNumber: false, userId: false },
    with: {
      user: { columns: { name: true } },
    },
    orderBy: (fields, { asc }) => asc(fields.createdAt),
    limit: safeLimit,
    offset,
  });
  const studentProfilesCount = await db
    .select({ count: count() })
    .from(connectStudentProfiles)
    .where(
      and(
        ne(connectStudentProfiles.universityName, ""),
        isNotNull(connectStudentProfiles.universityName),
        ne(connectStudentProfiles.universityName, "Not set"),
      ),
    );
  const totalCount = studentProfilesCount[0].count ?? 0;
  return {
    students: studentProfiles.length > 0 ? studentProfiles : [],
    total: totalCount,
  };
}
