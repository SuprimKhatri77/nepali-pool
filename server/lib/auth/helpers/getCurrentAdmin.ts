"use server";

import { UserSelectType } from "../../../../lib/db/schema";
import { getCurrentUser } from "./getCurrentUser";

type CurrentAdmin =
  | { success: true; adminRecord: UserSelectType }
  | { success: false; message: string };

export async function getCurrentAdmin(): Promise<CurrentAdmin> {
  const result = await getCurrentUser();
  if (!result.success) return result;

  const adminRecord = result.userRecord;
  if (adminRecord.role !== "admin") {
    return { success: false, message: "Access denied, Not an Admin" };
  }

  return { success: true, adminRecord };
}
