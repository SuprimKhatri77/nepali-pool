"use server";

import { eq } from "drizzle-orm";
import { db } from "../../../lib/db";
import { user } from "../../../lib/db/schema";

import { redirect } from "next/navigation";
import { getCurrentAdmin } from "../../lib/auth/helpers/getCurrentAdmin";

export type UserDetails = {
  id: string;
};

export async function deleteUserFromDB() {
  try {
    const result = await getCurrentAdmin();
    if (!result.success) return result;
    const adminRecord = result.adminRecord;
    await db.delete(user).where(eq(user.id, adminRecord.id));
    return redirect("/sign-up?toast=Account+deleted+succesfully");
  } catch (error) {
    console.error("Error deleting user: ", error);
  }
}
