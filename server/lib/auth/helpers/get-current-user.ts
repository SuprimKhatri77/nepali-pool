"use server";

import { db } from "../../../../lib/db";
import { UserSelectType } from "../../../../lib/db/schema";
import { getCurrentUserSession } from "./get-current-user-session";

type GetCurrentUserType = { user: UserSelectType | null };

export async function getCurrentUserRecord(): Promise<GetCurrentUserType> {
  const { session } = await getCurrentUserSession();
  if (!session) {
    return { user: null };
  }
  const userRecord = await db.query.user.findFirst({
    where: (fields, { eq }) => eq(fields.id, session.user.id),
  });

  if (!userRecord) {
    return { user: null };
  }
  return { user: userRecord };
}
