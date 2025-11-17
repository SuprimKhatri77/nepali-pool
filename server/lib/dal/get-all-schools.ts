"use server";

import { db } from "../../../lib/db";
import { SchoolSelectType } from "../../../lib/db/schema";

type SchoolReturnType =
  | { success: true; schools: SchoolSelectType[] }
  | { success: false; schools: null };
export async function getAllSchools(
  limit: number,
  offset: number
): Promise<SchoolReturnType> {
  const schools: SchoolSelectType[] = await db.query.school.findMany({
    limit,
    offset,
    orderBy: (school, { asc }) => [asc(school.id)],
  });

  if (schools.length === 0) {
    return {
      success: false,
      schools: null,
    };
  }

  return { success: true, schools };
}
