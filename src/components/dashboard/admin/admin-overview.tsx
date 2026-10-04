"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import {
  ClipboardCheck,
  FileCheck2,
  GraduationCap,
  MessageCircleQuestion,
  School,
  UserCheck,
  Users,
  Video,
} from "lucide-react";
import { AttentionLink, StatCard } from "@/components/dashboard/stat-card";
import { AdminOverviewSkeleton } from "@/components/dashboard/skeletons";
import { QueryErrorState } from "@/components/data-states/query-error-state";
import { adminOverviewQueryOptions } from "@/modules/admin-dashboard/queries";
import type { AdminOverview as AdminOverviewData } from "../../../../server/actions/admin-dashboard/overview";
import {
  ADMIN_MENTOR_APPLICATIONS_HREF,
  ADMIN_VIDEO_CALLS_HREF,
} from "./routes";
import { SignupsChart } from "./signups-chart";

function plural(n: number, one: string, many: string) {
  return `${n} ${n === 1 ? one : many}`;
}

export function AdminOverview() {
  const { data, error, isError, refetch, isFetching } = useQuery(
    adminOverviewQueryOptions(),
  );

  // A failed background refetch keeps showing the numbers we have.
  if (!data && !isError) return <AdminOverviewSkeleton />;

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          Overview
        </h1>
        <p className="mt-1 text-gray-600">
          How NepaliPool is doing, and what needs a decision.
        </p>
      </div>

      {data ? (
        <OverviewContent data={data} />
      ) : (
        <QueryErrorState
          title="Couldn't load the overview"
          error={error}
          onRetry={() => refetch()}
          isRetrying={isFetching}
        />
      )}
    </div>
  );
}

function OverviewContent({ data }: { data: AdminOverviewData }) {
  const attention = [
    data.mentors.pending > 0 && {
      href: ADMIN_MENTOR_APPLICATIONS_HREF,
      icon: FileCheck2,
      tone: "amber" as const,
      text: `${plural(data.mentors.pending, "mentor application", "mentor applications")} waiting for review`,
      cta: "Review",
    },
    data.pendingVideoCalls > 0 && {
      href: ADMIN_VIDEO_CALLS_HREF,
      icon: Video,
      tone: "emerald" as const,
      text: `${plural(data.pendingVideoCalls, "video call request", "video call requests")} to schedule`,
      cta: "Schedule",
    },
  ].filter((item) => item !== false);

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Users"
          value={data.users.total}
          icon={Users}
          hint={`${data.users.newLast30Days} new accounts in the last 30 days`}
        />
        <StatCard
          href="/admin/students"
          label="Students"
          value={data.users.students}
          icon={GraduationCap}
          hint="Accounts with the student role"
        />
        <StatCard
          href="/admin/mentors"
          label="Approved mentors"
          value={data.mentors.accepted}
          icon={UserCheck}
          hint={
            data.mentors.pending > 0
              ? `${data.mentors.pending} pending review`
              : "No applications pending"
          }
        />
        <StatCard
          href="/admin/schools"
          label="Schools"
          value={data.schools}
          icon={School}
          hint="In the directory"
        />
        <StatCard
          label="Service bookings"
          value={data.bookings.total}
          icon={ClipboardCheck}
          hint={
            data.bookings.pending > 0
              ? `${data.bookings.pending} waiting for mentor verification`
              : "None waiting for verification"
          }
        />
        <StatCard
          label="Open enquiries"
          value={data.openEnquiries}
          icon={MessageCircleQuestion}
          hint="Waiting for a mentor's reply"
        />
        <StatCard
          href={ADMIN_VIDEO_CALLS_HREF}
          label="Video call requests"
          value={data.pendingVideoCalls}
          icon={Video}
          hint="Pending scheduling"
        />
        <StatCard
          href={ADMIN_MENTOR_APPLICATIONS_HREF}
          label="Mentor applications"
          value={data.mentors.pending}
          icon={FileCheck2}
          hint="Pending review"
        />
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-900">Needs attention</h2>
        {attention.length > 0 ? (
          <ul className="space-y-3">
            {attention.map((item) => (
              <li key={item.href}>
                <AttentionLink {...item} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-xl border border-dashed border-slate-200 px-4 py-6 text-center text-sm text-slate-600">
            Nothing waiting on you.
          </p>
        )}
      </section>

      <SignupsChart signups={data.signups} />

      {data.recentApplications.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Latest mentor applications
            </h2>
            <Link
              href={ADMIN_MENTOR_APPLICATIONS_HREF}
              className="text-sm font-medium text-emerald-700 hover:underline"
            >
              View all
            </Link>
          </div>
          <ul className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
            {data.recentApplications.map((application) => (
              <li key={application.userId}>
                <Link
                  href={`${ADMIN_MENTOR_APPLICATIONS_HREF}/${application.userId}`}
                  className="flex flex-col gap-1 px-4 py-3 transition-colors hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium capitalize text-gray-900">
                      {application.name}
                    </p>
                    <p className="truncate text-sm text-gray-500">
                      {application.email}
                      {application.country && ` · ${application.country}`}
                    </p>
                  </div>
                  {application.appliedAt && (
                    <span className="shrink-0 text-xs text-gray-500">
                      Applied{" "}
                      {formatDistanceToNow(application.appliedAt, {
                        addSuffix: true,
                      })}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
