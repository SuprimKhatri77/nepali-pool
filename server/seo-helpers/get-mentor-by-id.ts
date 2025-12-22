import { db } from "../../lib/db";
import { MentorProfileSelectType, UserSelectType } from "../../lib/db/schema";

export async function getMentorById(
  mentorId: string
): Promise<(MentorProfileSelectType & { user: UserSelectType }) | null> {
  const mentorRecord = await db.query.mentorProfile.findFirst({
    where: (fields, { eq }) => eq(fields.userId, mentorId),
    with: {
      user: true,
    },
  });
  if (!mentorRecord) return null;

  return mentorRecord;
}
