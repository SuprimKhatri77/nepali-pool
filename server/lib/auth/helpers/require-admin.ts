"use server";

import { headers } from "next/headers";
import { auth } from "../auth";
import { redirect } from "next/navigation";
import { db } from "../../../../lib/db";
import { user } from "../../../../lib/db/schema";
import { eq } from "drizzle-orm";

export async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login?toast=Please+login+to+continue");

  const [userRecord] = await db
    .select()
    .from(user)
    .where(eq(user.id, session.user.id));
  if (!userRecord) {
    await auth.api.signOut({ headers: await headers() });
    redirect("/login?toast=Please+login+to+continue");
  }
  if (!userRecord.emailVerified) redirect("/verify-email?toast=Please+verify+your+email+first");
  if (!userRecord.role || userRecord.role === "none") redirect("/select-role");
  if (userRecord.role !== "admin") redirect(`/dashboard/${userRecord.role}`);
}
