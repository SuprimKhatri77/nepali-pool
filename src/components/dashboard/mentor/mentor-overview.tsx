"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { format, isToday, isTomorrow } from "date-fns";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  Briefcase,
  CalendarClock,
  ClipboardCheck,
  MessageCircleQuestion,
  MessagesSquare,
  Users,
  Video,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { QueryErrorState } from "@/components/data-states/query-error-state";
import { MentorOverviewSkeleton } from "@/components/dashboard/skeletons";
import { mentorOverviewQueryOptions } from "@/modules/mentor-dashboard/queries";
import { cn } from "@/components/lib/utils";
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
  const { data, error, isPending, isError, refetch, isFetching } = useQuery(
    mentorOverviewQueryOptions(),
  );

  if (isPending) return <MentorOverviewSkeleton />;

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

      {isError ? (
        <QueryErrorState
          title="Couldn't load your overview"
          error={error}
          onRetry={() => refetch()}
          isRetrying={isFetching}
        />
      ) : (
        <OverviewContent data={data} />
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

function StatCard({
  href,
  label,
  value,
  icon: Icon,
  hint,
  hintIcon: HintIcon,
}: {
  href?: string;
  label: string;
  value: number;
  icon: LucideIcon;
  hint: string;
  hintIcon?: LucideIcon;
}) {
  const card = (
    <Card
      className={cn(
        "h-full border-slate-200 py-0 transition-shadow",
        href && "hover:shadow-md",
      )}
    >
      <CardContent className="flex items-start justify-between gap-4 p-5">
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">{value}</p>
          <p className="mt-1 flex items-start gap-1 text-xs leading-snug text-gray-500">
            {HintIcon && <HintIcon className="mt-px size-3 shrink-0" />}
            <span>{hint}</span>
          </p>
        </div>
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
          <Icon className="size-5" />
        </div>
      </CardContent>
    </Card>
  );

  return href ? (
    <Link
      href={href}
      className="rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
    >
      {card}
    </Link>
  ) : (
    card
  );
}

const tones = {
  amber: "border-amber-200 bg-amber-50 text-amber-900 hover:bg-amber-100/70",
  emerald:
    "border-emerald-200 bg-emerald-50 text-emerald-900 hover:bg-emerald-100/70",
  slate: "border-slate-200 bg-white text-slate-900 hover:bg-slate-50",
};

function AttentionLink({
  href,
  icon: Icon,
  tone,
  text,
  cta,
}: {
  href: string;
  icon: LucideIcon;
  tone: keyof typeof tones;
  text: string;
  cta: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center justify-between gap-4 rounded-lg border p-4 transition-colors",
        tones[tone],
      )}
    >
      <span className="flex items-center gap-3 text-sm font-medium">
        <Icon className="size-5 shrink-0" />
        {text}
      </span>
      <span className="flex shrink-0 items-center gap-1 text-sm font-semibold">
        {cta}
        <ArrowRight className="size-4" />
      </span>
    </Link>
  );
}
