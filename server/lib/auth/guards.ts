import "server-only";

import { redirect } from "next/navigation";
import type {
  StudentProfileSelectType,
  UserSelectType,
} from "../../../lib/db/schema";
import type { MentorProfileWithUser } from "../../../types/all-types";
import { getViewer, homeFor, type Viewer, type ViewerStatus } from "./viewer";
import { safeNext } from "../../../src/utils/safe-next";

// ---------------------------------------------------------------------------
// Page guards: redirect anyone who doesn't belong to where they do belong.
// ---------------------------------------------------------------------------

function redirectTargetFor(viewer: Viewer): string {
  switch (viewer.status) {
    case "anonymous":
      return "/login?message=Please+login+to+continue";
    case "invalid":
      return "/login?error=invalid_session";
    case "unverified":
      return "/verify-email?message=Please+verify+your+email";
    case "needs-onboarding":
      return `/onboarding/${viewer.role}?message=Please+complete+the+onboarding+to+continue!`;
    default:
      return homeFor(viewer);
  }
}

// Lets through only viewers whose status is listed; everyone else is sent
// home (or to the step of the signup flow they still have to finish).
export async function requireViewer<S extends ViewerStatus>(
  allowed: readonly S[],
): Promise<Extract<Viewer, { status: S }>> {
  const viewer = await getViewer();
  if ((allowed as readonly ViewerStatus[]).includes(viewer.status)) {
    return viewer as Extract<Viewer, { status: S }>;
  }
  redirect(redirectTargetFor(viewer));
}

// Anyone who finished signup (verified email + a role), onboarded or not.
export const SIGNED_UP = [
  "needs-onboarding",
  "mentor-pending",
  "mentor-rejected",
  "student",
  "mentor",
  "admin",
] as const satisfies readonly ViewerStatus[];

export type SignedUpViewer = Extract<
  Viewer,
  { status: (typeof SIGNED_UP)[number] }
>;

// Fully onboarded users: students with a profile, approved mentors, admins.
export const ONBOARDED = [
  "student",
  "mentor",
  "admin",
] as const satisfies readonly ViewerStatus[];

export function requireUser(): Promise<SignedUpViewer> {
  return requireViewer(SIGNED_UP);
}

export async function requireStudent() {
  const viewer = await requireViewer(["student"]);
  return { userRecord: viewer.user, studentRecord: viewer.studentProfile };
}

export async function requireApprovedMentor() {
  const viewer = await requireViewer(["mentor"]);
  return { userRecord: viewer.user, mentorRecord: viewer.mentorProfile };
}

export async function requireAdmin() {
  const viewer = await requireViewer(["admin"]);
  return viewer.user;
}

// Pages only for people who are not signed in (login, sign-up): a signed-in
// viewer is sent to `next` (when it's a safe same-site path) or home.
export async function redirectIfSignedIn(next?: unknown) {
  const viewer = await getViewer();
  if (viewer.status !== "anonymous" && viewer.status !== "invalid") {
    redirect(safeNext(next) ?? homeFor(viewer));
  }
}

// ---------------------------------------------------------------------------
// Action guards: never redirect, return a result the caller can report.
// ---------------------------------------------------------------------------

type Failure = { success: false; message: string };

function failureFor(viewer: Viewer): Failure {
  switch (viewer.status) {
    case "anonymous":
      return { success: false, message: "Unauthorized" };
    case "invalid":
      return { success: false, message: "User not found" };
    case "unverified":
      return { success: false, message: "Email not verified" };
    case "no-role":
      return { success: false, message: "Missing user role" };
    case "needs-onboarding":
      return { success: false, message: "Please complete your onboarding" };
    case "mentor-pending":
      return {
        success: false,
        message: "Access denied, Mentor status is pending",
      };
    case "mentor-rejected":
      return {
        success: false,
        message: "Access denied, Mentor status is rejected",
      };
    default:
      return { success: false, message: "Access denied" };
  }
}

// Verified user with a role (profile not required).
export async function getCurrentUser(): Promise<
  { success: true; userRecord: UserSelectType } | Failure
> {
  const viewer = await getViewer();
  switch (viewer.status) {
    case "anonymous":
    case "invalid":
    case "unverified":
    case "no-role":
      return failureFor(viewer);
    default:
      return { success: true, userRecord: viewer.user };
  }
}

export async function getCurrentStudent(): Promise<
  | {
      success: true;
      studentRecord: StudentProfileSelectType & { user: UserSelectType };
    }
  | Failure
> {
  const viewer = await getViewer();
  switch (viewer.status) {
    case "student":
      break;
    case "needs-onboarding":
      return viewer.role === "student"
        ? { success: false, message: "Student doesn't have a student profile" }
        : { success: false, message: "Access denied, Not a Student" };
    case "mentor":
    case "mentor-pending":
    case "mentor-rejected":
    case "admin":
      return { success: false, message: "Access denied, Not a Student" };
    default:
      return failureFor(viewer);
  }
  return {
    success: true,
    studentRecord: { ...viewer.studentProfile, user: viewer.user },
  };
}

export async function getCurrentMentor(): Promise<
  { success: true; mentorRecord: MentorProfileWithUser } | Failure
> {
  const viewer = await getViewer();
  switch (viewer.status) {
    case "mentor":
      break;
    case "needs-onboarding":
      return viewer.role === "mentor"
        ? { success: false, message: "Missing mentor profile record" }
        : { success: false, message: "Access denied, Not a Mentor" };
    case "student":
    case "admin":
      return { success: false, message: "Access denied, Not a Mentor" };
    default:
      return failureFor(viewer);
  }
  return {
    success: true,
    mentorRecord: { ...viewer.mentorProfile, user: viewer.user },
  };
}

export async function getCurrentAdmin(): Promise<
  { success: true; adminRecord: UserSelectType } | Failure
> {
  const viewer = await getViewer();
  if (viewer.status !== "admin") return failureFor(viewer);
  return { success: true, adminRecord: viewer.user };
}
