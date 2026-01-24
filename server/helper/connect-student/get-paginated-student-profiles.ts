"use server";

import { count } from "drizzle-orm";
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
    with: {
      user: true,
    },
    orderBy: (fields, { asc }) => asc(fields.createdAt),
    limit,
    offset,
  });

  const studentProfilesCount = await db
    .select({ count: count() })
    .from(connectStudentProfiles);
  const totalCount = studentProfilesCount[0].count ?? 0;
  return {
    students: studentProfiles.length > 0 ? studentProfiles : [],
    total: totalCount,
  };
}
