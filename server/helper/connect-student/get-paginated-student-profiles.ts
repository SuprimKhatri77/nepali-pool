"use server";

import { and, count, isNotNull, ne } from "drizzle-orm";
import { db } from "../../../lib/db";
import {
  connectStudentProfiles,
  ConnectStudentProfileSelectType,
  UserSelectType,
} from "../../../lib/db/schema";

export async function getPaginatedStudentProfiles(
  page: number = 0,
  limit: number,
): Promise<{
  students: (ConnectStudentProfileSelectType & { user: UserSelectType })[] | [];
  total: number;
}> {
  const offset = page * limit;

  const studentProfiles = await db.query.connectStudentProfiles.findMany({
    where: (fields, { isNotNull, and, ne }) =>
      and(
        ne(fields.universityName, ""),
        isNotNull(fields.universityName),
        ne(fields.universityName, "Not set"),
      ),
    with: {
      user: true,
    },
    orderBy: (fields, { asc }) => asc(fields.createdAt),
    limit,
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
