"use server";

import { eq, ne } from "drizzle-orm";
import { db } from "../../../lib/db";
import { school, SchoolSelectType } from "../../../lib/db/schema";

export async function getSchool(
  schoolId: string
): Promise<
  | {
      success: true;
      school: SchoolSelectType;
      recommendedSchools: SchoolSelectType[] | [];
    }
  | { success: false }
> {
  const [specificSchool] = await db
    .select()
    .from(school)
    .where(eq(school.id, schoolId))
    .limit(1);

  if (!specificSchool) {
    return { success: false };
  }

  const recommendedSchools: SchoolSelectType[] = await db.query.school.findMany(
    {
      where: ne(school.id, schoolId),
      limit: 3,
    }
  );

  return {
    success: true,
    school: specificSchool,
    recommendedSchools: recommendedSchools ?? [],
  };
}
