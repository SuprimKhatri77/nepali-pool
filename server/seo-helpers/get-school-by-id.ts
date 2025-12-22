import { db } from "../../lib/db";
import { SchoolSelectType } from "../../lib/db/schema";

export async function getSchoolById(
  schoolId: string
): Promise<SchoolSelectType | null> {
  const schoolRecord = await db.query.school.findFirst({
    where: (fields, { eq }) => eq(fields.id, schoolId),
  });
  if (!schoolRecord) return null;
  return schoolRecord;
}
