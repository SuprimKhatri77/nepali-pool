"use server";

import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { user, UserSelectType } from "../../../../lib/db/schema";
import { auth } from "../auth";
import { db } from "../../../../lib/db";

type CurrentUser =
  | { success: true; userRecord: UserSelectType }
  | { success: false; message: string };
export async function getCurrentUser(): Promise<CurrentUser> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return { message: "Unauthorized", success: false };
  }

  const [userRecord] = await db
    .select()
    .from(user)
    .where(eq(user.id, session.user.id));
  if (!userRecord) {
    return { message: "User not found", success: false };
  }

  if (!userRecord.emailVerified) {
    return { message: "Users email is not verified", success: false };
  }
  if (!userRecord.role || userRecord.role === "none") {
    return { message: "Missing user role", success: false };
  }

  return { success: true, userRecord };
}
