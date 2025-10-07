"use server";

import { eq } from "drizzle-orm";
import { db } from "../../../lib/db";
import { user } from "../../../lib/db/schema";
import { auth } from "../../lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export type UserDetails = {
  id: string;
};

export async function deleteUserFromDB() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return redirect("/login");
  }
  try {
    await db.delete(user).where(eq(user.id, session.user.id));
    return redirect("/sign-up");
  } catch (error) {
    console.error("Error deleting user: ", error);
  }
}
