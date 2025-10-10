"use server";

import { db } from "../../../../lib/db";
import {
  studentProfile,
  StudentProfileSelectType,
  UserSelectType,
} from "../../../../lib/db/schema";
import { getCurrentUser } from "./getCurrentUser";

type CurrentStudent =
  | {
      success: true;
      studentRecord: StudentProfileSelectType & { user: UserSelectType };
    }
  | { success: false; message: string };

export async function getCurrentStudent(): Promise<CurrentStudent> {
  const result = await getCurrentUser();
  if (!result.success) {
    console.error(result.message);
    return result;
  }

  const userRecord = result.userRecord;
  if (userRecord.role !== "student") {
    return { message: "Access denied, Not a Student", success: false };
  }

  const studentRecord = await db.query.studentProfile.findFirst({
    where: (fields, { eq }) => eq(studentProfile.userId, userRecord.id),
    with: {
      user: true,
    },
  });

  if (!studentRecord) {
    return {
      message: "Student doesn't have a student profile",
      success: false,
    };
  }

  return { success: true, studentRecord };
}
