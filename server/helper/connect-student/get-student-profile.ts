"use server";

import { db } from "../../../lib/db";
import { auth } from "../../lib/auth/auth";
import { headers } from "next/headers";
import {
  ConnectStudentProfileSelectType,
  UserSelectType,
} from "../../../lib/db/schema";

type GetStudentProfilesResult = {
  students: (ConnectStudentProfileSelectType & {
    user: UserSelectType | null;
  })[];
  hasCurrentUserProfile: boolean;
  hasSession: boolean;
};

export async function getStudentProfiles(): Promise<GetStudentProfilesResult> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    const students = await db.query.connectStudentProfiles.findMany({
      with: {
        user: true,
      },
    });
    return {
      students: students ?? [],
      hasCurrentUserProfile: false,
      hasSession: false,
    };
  }

  const myProfile = await db.query.connectStudentProfiles.findFirst({
    where: (fields, { eq }) => eq(fields.userId, session.user.id),
  });

  const students = await db.query.connectStudentProfiles.findMany({
    where: (fields, { ne }) => ne(fields.userId, session.user.id),
    with: {
      user: true,
    },
  });

  return {
    students,
    hasCurrentUserProfile: Boolean(myProfile),
    hasSession: true,
  };
}
