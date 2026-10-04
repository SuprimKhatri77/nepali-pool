"use server";

import { count, desc, eq, gte, sql } from "drizzle-orm";
import { db } from "../../../lib/db";
import {
  mentorEnquiry,
  mentorProfile,
  school,
  serviceBooking,
  user,
  videoCall,
} from "../../../lib/db/schema";
import type { ActionResult } from "../../../src/utils/action-result";
import { getCurrentAdmin } from "../../lib/auth/guards";

const SIGNUP_DAYS = 90;

export type SignupDay = { day: string; students: number; mentors: number };

export type AdminOverview = {
  users: { total: number; newLast30Days: number; students: number };
  mentors: { accepted: number; pending: number };
  pendingVideoCalls: number;
  bookings: { total: number; pending: number };
  openEnquiries: number;
  schools: number;
  // One entry per UTC day, oldest first, zero-filled.
  signups: SignupDay[];
  recentApplications: {
    userId: string;
    name: string;
    email: string;
    country: string | null;
    appliedAt: Date | null;
  }[];
};

// Midnight UTC, `daysAgo` days before today.
function utcDay(today: Date, daysAgo: number) {
  return new Date(
    Date.UTC(
      today.getUTCFullYear(),
      today.getUTCMonth(),
      today.getUTCDate() - daysAgo,
    ),
  );
}

// `user.created_at` is a timestamp without time zone holding UTC wall time,
// so compare it with a UTC wall-time literal (no zone conversion involved).
function asUtcTimestamp(date: Date) {
  return sql`${date.toISOString().slice(0, 19).replace("T", " ")}::timestamp`;
}

export async function getAdminOverview(): Promise<ActionResult<AdminOverview>> {
  const current = await getCurrentAdmin();
  if (!current.success) return current;

  // One "today" for the SQL windows and the zero-fill, so they can't drift
  // apart around midnight or with clock skew between app and database.
  const today = new Date();
  const since30Days = asUtcTimestamp(utcDay(today, 29));
  const sinceSignupWindow = asUtcTimestamp(utcDay(today, SIGNUP_DAYS - 1));
  const signupDay = sql<string>`to_char(date_trunc('day', ${user.createdAt}), 'YYYY-MM-DD')`;

  const [
    [users],
    [mentors],
    [calls],
    [bookings],
    [enquiries],
    [schools],
    signupRows,
    recentApplications,
  ] = await Promise.all([
    db
      .select({
        total: count(),
        newLast30Days: count(
          sql`case when ${user.createdAt} >= ${since30Days} then 1 end`,
        ),
        students: count(sql`case when ${user.role} = 'student' then 1 end`),
      })
      .from(user),
    db
      .select({
        accepted: count(
          sql`case when ${mentorProfile.verifiedStatus} = 'accepted' then 1 end`,
        ),
        pending: count(
          sql`case when ${mentorProfile.verifiedStatus} = 'pending' then 1 end`,
        ),
      })
      .from(mentorProfile),
    db
      .select({ pending: count() })
      .from(videoCall)
      .where(eq(videoCall.status, "pending")),
    db
      .select({
        total: count(),
        pending: count(
          sql`case when ${serviceBooking.status} = 'pending' then 1 end`,
        ),
      })
      .from(serviceBooking),
    db
      .select({ open: count() })
      .from(mentorEnquiry)
      .where(eq(mentorEnquiry.status, "new")),
    db.select({ total: count() }).from(school),
    db
      .select({
        day: signupDay,
        students: count(sql`case when ${user.role} = 'student' then 1 end`),
        mentors: count(sql`case when ${user.role} = 'mentor' then 1 end`),
      })
      .from(user)
      .where(gte(user.createdAt, sinceSignupWindow))
      .groupBy(signupDay),
    db
      .select({
        userId: mentorProfile.userId,
        name: user.name,
        email: user.email,
        country: mentorProfile.country,
        appliedAt: mentorProfile.createdAt,
      })
      .from(mentorProfile)
      .innerJoin(user, eq(user.id, mentorProfile.userId))
      .where(eq(mentorProfile.verifiedStatus, "pending"))
      .orderBy(
        sql`${mentorProfile.createdAt} desc nulls last`,
        desc(mentorProfile.userId),
      )
      .limit(5),
  ]);

  return {
    success: true,
    data: {
      users,
      mentors,
      pendingVideoCalls: calls.pending,
      bookings,
      openEnquiries: enquiries.open,
      schools: schools.total,
      signups: fillSignupDays(signupRows, today),
      recentApplications,
    },
  };
}

function fillSignupDays(rows: SignupDay[], today: Date): SignupDay[] {
  const byDay = new Map(rows.map((row) => [row.day, row]));
  const days: SignupDay[] = [];
  for (let offset = SIGNUP_DAYS - 1; offset >= 0; offset--) {
    const day = utcDay(today, offset).toISOString().slice(0, 10);
    days.push(byDay.get(day) ?? { day, students: 0, mentors: 0 });
  }
  return days;
}

// Sidebar badges: the two queues an admin works through.
export async function getAdminNavCounts(): Promise<
  ActionResult<{ pendingApplications: number; pendingVideoCalls: number }>
> {
  const current = await getCurrentAdmin();
  if (!current.success) return current;

  const [[applications], [calls]] = await Promise.all([
    db
      .select({ pending: count() })
      .from(mentorProfile)
      .where(eq(mentorProfile.verifiedStatus, "pending")),
    db
      .select({ pending: count() })
      .from(videoCall)
      .where(eq(videoCall.status, "pending")),
  ]);

  return {
    success: true,
    data: {
      pendingApplications: applications.pending,
      pendingVideoCalls: calls.pending,
    },
  };
}
