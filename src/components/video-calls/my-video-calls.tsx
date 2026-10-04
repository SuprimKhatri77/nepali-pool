"use client";

import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { CalendarClock, Video } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/data-states/empty-state";
import { QueryErrorState } from "@/components/data-states/query-error-state";
import { CardGridSkeleton } from "@/components/data-states/skeletons";
import { FilterTabs } from "@/components/dashboard/filter-tabs";
import { useTableParams } from "@/components/dashboard/use-table-params";
import {
  myVideoCallCountsQueryOptions,
  myVideoCallsQueryOptions,
  type VideoCallStatus,
} from "@/modules/video-calls/queries";
import type { MyVideoCall } from "../../../server/actions/video-calls/list";

const FILTERS = [
  { value: "pending", label: "Pending" },
  { value: "scheduled", label: "Scheduled" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
] as const satisfies readonly { value: VideoCallStatus; label: string }[];

const STATUS_BADGE: Record<VideoCallStatus, string> = {
  pending: "border-amber-200 bg-amber-50 text-amber-800",
  scheduled: "border-sky-200 bg-sky-50 text-sky-800",
  completed: "border-emerald-200 bg-emerald-50 text-emerald-800",
  cancelled: "border-slate-200 bg-slate-50 text-slate-600",
};

type Role = "student" | "mentor";

export function MyVideoCalls({ role }: { role: Role }) {
  const { searchParams, setParams } = useTableParams();
  const requested = searchParams.get("status");
  const status =
    FILTERS.find((filter) => filter.value === requested)?.value ??
    FILTERS[0].value;

  const { data: counts } = useQuery(myVideoCallCountsQueryOptions());
  const { data, error, isError, refetch, isFetching } = useQuery(
    myVideoCallsQueryOptions(status),
  );

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          Video calls
        </h1>
        <p className="mt-1 text-gray-600">
          {role === "student"
            ? "One-to-one calls you've booked with mentors."
            : "One-to-one calls students have booked with you."}
        </p>
      </div>

      <FilterTabs
        label="Status"
        options={FILTERS}
        value={status}
        counts={counts}
        onChange={(next) => setParams({ status: next })}
      />

      {!data ? (
        isError ? (
          <QueryErrorState
            title="Couldn't load your video calls"
            error={error}
            onRetry={() => refetch()}
            isRetrying={isFetching}
          />
        ) : (
          <CardGridSkeleton count={3} />
        )
      ) : data.length === 0 ? (
        <EmptyState
          icon={Video}
          title={`No ${status} video calls`}
          description={
            status === "pending" && role === "student"
              ? "Book a video call from a mentor's profile and it will show up here."
              : undefined
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((call) => (
            <VideoCallCard key={call.id} call={call} role={role} />
          ))}
        </div>
      )}
    </div>
  );
}

// What the card asks the viewer to do next, if anything. Students propose
// times on the schedule page; mentors answer on the respond page.
function nextStep(call: MyVideoCall, role: Role) {
  const href =
    role === "student"
      ? `/video-call/schedule/${call.id}`
      : `/video-call/respond/${call.id}`;
  if (call.status === "scheduled") return { href, label: "View details" };
  if (call.status !== "pending") return null;
  // The student suggests the first time; until then the mentor waits.
  if (role === "mentor" && !call.proposed.byStudent) return null;
  const proposedByMe =
    role === "student" ? call.proposed.byStudent : call.proposed.byMentor;
  return { href, label: proposedByMe ? "Review your date" : "Select a date" };
}

const HINT: Record<Role, Record<VideoCallStatus, string>> = {
  student: {
    pending:
      "Pick a time that suits you. The mentor confirms it or suggests another.",
    scheduled: "Your video call is scheduled.",
    completed: "This video call is complete.",
    cancelled: "This video call was cancelled.",
  },
  mentor: {
    pending: "The student suggested a time: confirm it or offer another.",
    scheduled: "Your video call with this student is scheduled.",
    completed: "This video call is complete.",
    cancelled: "This video call was cancelled.",
  },
};

function VideoCallCard({ call, role }: { call: MyVideoCall; role: Role }) {
  const status = call.status ?? "pending";
  const step = nextStep(call, role);

  return (
    <Card className="h-full gap-0 border-emerald-100 py-0">
      <CardContent className="flex h-full flex-col gap-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="relative size-12 shrink-0 overflow-hidden rounded-full bg-emerald-50 ring-2 ring-emerald-100">
              {call.other.imageUrl ? (
                <Image
                  src={call.other.imageUrl}
                  alt=""
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              ) : (
                <span className="flex size-full items-center justify-center font-semibold text-emerald-700">
                  {call.other.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-500">
                {role === "student" ? "Mentor" : "Student"}
              </p>
              <p className="truncate font-semibold capitalize text-gray-900">
                {call.other.name}
              </p>
            </div>
          </div>
          <Badge variant="outline" className={STATUS_BADGE[status]}>
            {FILTERS.find((filter) => filter.value === status)?.label}
          </Badge>
        </div>

        <p className="text-sm text-gray-600">
          {role === "mentor" && status === "pending" && !call.proposed.byStudent
            ? "Waiting for the student to suggest a time."
            : HINT[role][status]}
        </p>
        {call.scheduledTime && (
          <p className="flex items-center gap-1.5 text-sm font-medium text-gray-800">
            <CalendarClock className="size-4 text-emerald-600" />
            {format(call.scheduledTime, "EEE, d MMM yyyy 'at' h:mm a")}
          </p>
        )}

        {step && (
          <Button
            asChild
            className="mt-auto w-full bg-emerald-600 text-white hover:bg-emerald-700"
          >
            <Link href={step.href}>{step.label}</Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
