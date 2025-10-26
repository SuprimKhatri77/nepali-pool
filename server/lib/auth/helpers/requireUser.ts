"use server";

import { headers } from "next/headers";
import { auth } from "../auth";
import { redirect } from "next/navigation";
import { db } from "../../../../lib/db";
import { user, UserSelectType } from "../../../../lib/db/schema";
import { eq } from "drizzle-orm";

type User = UserSelectType;

export async function requireUser(): Promise<User> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return redirect("/login?toast=Please+login+to+continue");
  }

  const [userRecord] = await db
    .select()
    .from(user)
    .where(eq(user.id, session.user.id));
  if (!userRecord) {
    await auth.api.signOut({ headers: await headers() });
    return redirect("/login?toast=Please+login+to+continue");
  }

  if (!userRecord.emailVerified) {
    return redirect("/verify-email?toast=Please+verify+your+email+first");
  }
  if (!userRecord.role || userRecord.role === "none") {
    return redirect("/select-role");
  }

  return userRecord;
}
