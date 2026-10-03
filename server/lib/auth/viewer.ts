import "server-only";

import { cache } from "react";
import { headers } from "next/headers";
import { db } from "../../../lib/db";
import type {
  MentorProfileSelectType,
  StudentProfileSelectType,
  UserSelectType,
} from "../../../lib/db/schema";
import { auth } from "./auth";

// Single source of truth for "who is making this request and where are they
// in the signup flow". Both helpers are wrapped in React `cache()`, so layouts,
// pages and guards can all call them freely: the session and the user row are
// loaded at most once per request.

export type Viewer =
  | { status: "anonymous" }
  // A session whose user row no longer exists.
  | { status: "invalid" }
  | { status: "unverified"; user: UserSelectType }
  | { status: "no-role"; user: UserSelectType }
  | {
      status: "needs-onboarding";
      user: UserSelectType;
      role: "student" | "mentor";
    }
  | {
      status: "mentor-pending" | "mentor-rejected";
      user: UserSelectType;
      mentorProfile: MentorProfileSelectType;
    }
  | {
      status: "student";
      user: UserSelectType;
      studentProfile: StudentProfileSelectType;
    }
  | {
      status: "mentor";
      user: UserSelectType;
      mentorProfile: MentorProfileSelectType;
    }
  | { status: "admin"; user: UserSelectType };

export type ViewerStatus = Viewer["status"];

export const getSession = cache(async () =>
  auth.api.getSession({ headers: await headers() }),
);

export const getViewer = cache(async (): Promise<Viewer> => {
  const session = await getSession();
  if (!session) return { status: "anonymous" };

  const record = await db.query.user.findFirst({
    where: (fields, { eq }) => eq(fields.id, session.user.id),
    with: { studentProfile: true, mentorProfile: true },
  });
  if (!record) return { status: "invalid" };

  const { studentProfile, mentorProfile, ...user } = record;
  if (!user.emailVerified) return { status: "unverified", user };

  switch (user.role) {
    case "admin":
      return { status: "admin", user };
    case "student":
      return studentProfile
        ? { status: "student", user, studentProfile }
        : { status: "needs-onboarding", user, role: "student" };
    case "mentor":
      if (!mentorProfile) {
        return { status: "needs-onboarding", user, role: "mentor" };
      }
      // A null status predates the column default; treat it as approved, as
      // the old helpers did.
      if (mentorProfile.verifiedStatus === "pending") {
        return { status: "mentor-pending", user, mentorProfile };
      }
      if (mentorProfile.verifiedStatus === "rejected") {
        return { status: "mentor-rejected", user, mentorProfile };
      }
      return { status: "mentor", user, mentorProfile };
    default:
      return { status: "no-role", user };
  }
});

// Where a viewer belongs when they land somewhere they can't use.
export function homeFor(viewer: Viewer): string {
  switch (viewer.status) {
    case "anonymous":
    case "invalid":
      return "/login";
    case "unverified":
      return "/verify-email";
    case "no-role":
      return "/select-role";
    case "needs-onboarding":
      return `/onboarding/${viewer.role}`;
    case "mentor-pending":
      return "/waitlist";
    case "mentor-rejected":
      return "/rejected";
    case "student":
      return "/dashboard/student";
    case "mentor":
      return "/dashboard/mentor";
    case "admin":
      return "/admin";
  }
}
