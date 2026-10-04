"use client";

import { useQuery } from "@tanstack/react-query";
import { format, isToday, isTomorrow } from "date-fns";
import {
  Briefcase,
  CalendarClock,
  ClipboardCheck,
  MessageCircleQuestion,
  MessagesSquare,
  Users,
  Video,
} from "lucide-react";
import { QueryErrorState } from "@/components/data-states/query-error-state";
import { MentorOverviewSkeleton } from "@/components/dashboard/skeletons";
import { mentorOverviewQueryOptions } from "@/modules/mentor-dashboard/queries";
import { AttentionLink, StatCard } from "@/components/dashboard/stat-card";
import type { MentorDashboardOverview } from "../../../../server/actions/mentor-dashboard/get-mentor-dashboard-overview";
import { MENTOR_DASHBOARD_HREF } from "./mentor-dashboard-shell";

function plural(n: number, one: string, many: string) {
  return `${n} ${n === 1 ? one : many}`;
}

function formatNextCall(date: Date) {
  const time = format(date, "h:mm a");
  if (isToday(date)) return `Today at ${time}`;
  if (isTomorrow(date)) return `Tomorrow at ${time}`;
  return format(date, "EEE, MMM d 'at' h:mm a");
}

export function MentorOverview({ firstName }: { firstName: string }) {
  const { data, error, isError, refetch, isFetching } = useQuery(
    mentorOverviewQueryOptions(),
  );

  // A failed background refetch keeps showing the numbers we have.
  if (!data && !isError) return <MentorOverviewSkeleton />;

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          Welcome back, {firstName}
        </h1>
        <p className="mt-1 text-gray-600">
          Here&apos;s what&apos;s happening with your mentorship.
        </p>
      </div>

      {data ? (
        <OverviewContent data={data} />
      ) : (
        <QueryErrorState
          title="Couldn't load your overview"
          error={error}
          onRetry={() => refetch()}
          isRetrying={isFetching}
        />
      )}
    </div>
  );
}

function OverviewContent({ data }: { data: MentorDashboardOverview }) {
  const attention = [
    data.pendingBookings > 0 && {
      href: `${MENTOR_DASHBOARD_HREF}/bookings?status=pending`,
      icon: ClipboardCheck,
      tone: "amber" as const,
      text: `${plural(data.pendingBookings, "booking", "bookings")} waiting for payment verification`,
      cta: "Review",
    },
    data.newEnquiries > 0 && {
      href: `${MENTOR_DASHBOARD_HREF}/enquiries?status=new`,
      icon: MessageCircleQuestion,
      tone: "emerald" as const,
      text: `${plural(data.newEnquiries, "new enquiry", "new enquiries")} waiting for a reply`,
      cta: "Reply",
    },
    data.activeServices === 0 && {
      href: `${MENTOR_DASHBOARD_HREF}/services`,
      icon: Briefcase,
      tone: "slate" as const,
      text: "You don't offer any services yet. Add one so students can book you.",
      cta: "Add a service",
    },
  ].filter((item) => item !== false);

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          href="/chats"
          label="Active chats"
          value={data.activeChats}
          icon={MessagesSquare}
          hint={
            data.newChatsThisWeek > 0
              ? `${data.newChatsThisWeek} new this week`
              : "No new chats this week"
          }
        />
        <StatCard
          href="/video-call"
          label="Upcoming calls"
          value={data.upcomingCalls}
          icon={Video}
          hint={
            data.nextCallAt
              ? `Next: ${formatNextCall(data.nextCallAt)}`
              : "None scheduled"
          }
          hintIcon={CalendarClock}
        />
        <StatCard
          label="Students"
          value={data.totalStudents}
          icon={Users}
          hint="All time"
        />
        <StatCard
          href={`${MENTOR_DASHBOARD_HREF}/bookings`}
          label="Pending bookings"
          value={data.pendingBookings}
          icon={ClipboardCheck}
          hint="Waiting for verification"
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
            You&apos;re all caught up.
          </p>
        )}
      </section>
    </>
  );
}
