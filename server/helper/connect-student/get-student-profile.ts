import "server-only";

import { db } from "../../../lib/db";
import { ConnectStudentProfileSelectType } from "../../../lib/db/schema";
import { getViewer } from "../../lib/auth/viewer";

type ConnectStudentViewer = {
  hasCurrentUserProfile: boolean;
  hasSession: boolean;
  role: "student" | "mentor" | "admin" | null;
  user: ConnectStudentProfileSelectType | undefined;
};

// What /connect-student needs to know about the visitor: whether they are
// signed in, their role, and their own student card. The list of cards is
// loaded page by page on the client (getPaginatedStudentProfiles).
export async function getStudentProfiles(): Promise<ConnectStudentViewer> {
  const viewer = await getViewer();
  if (viewer.status === "anonymous" || viewer.status === "invalid") {
    return {
      hasCurrentUserProfile: false,
      hasSession: false,
      role: null,
      user: undefined,
    };
  }

  const myProfile = await db.query.connectStudentProfiles.findFirst({
    where: (fields, { eq }) => eq(fields.userId, viewer.user.id),
  });
  const role = viewer.user.role;

  return {
    hasCurrentUserProfile: Boolean(myProfile),
    hasSession: true,
    role: role === "none" ? null : role,
    user: myProfile,
  };
}
