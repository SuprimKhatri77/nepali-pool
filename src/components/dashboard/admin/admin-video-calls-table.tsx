"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { CalendarClock, ChevronRight, Video } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/components/lib/utils";
import { EmptyState } from "@/components/data-states/empty-state";
import { QueryErrorState } from "@/components/data-states/query-error-state";
import { AdminTableSkeleton } from "@/components/dashboard/skeletons";
import {
  adminVideoCallCountsQueryOptions,
  adminVideoCallsQueryOptions,
} from "@/modules/admin-dashboard/queries";
import type {
  AdminVideoCallFilter,
  AdminVideoCallRow,
} from "../../../../server/actions/admin-dashboard/calls";
import { FilterTabs } from "@/components/dashboard/filter-tabs";
import { ADMIN_VIDEO_CALLS_HREF } from "./routes";
import { TablePagination } from "./table-pagination";
import { useTableParams } from "@/components/dashboard/use-table-params";

// Pending first: that's the queue an admin works through.
const FILTERS = [
  { value: "pending", label: "Pending" },
  { value: "scheduled", label: "Scheduled" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "all", label: "All" },
] as const satisfies readonly { value: AdminVideoCallFilter; label: string }[];

const STATUS_META: Record<
  NonNullable<AdminVideoCallRow["status"]>,
  { label: string; className: string }
> = {
  pending: {
    label: "Pending",
    className: "border-amber-200 bg-amber-50 text-amber-800",
  },
  scheduled: {
    label: "Scheduled",
    className: "border-sky-200 bg-sky-50 text-sky-800",
  },
  completed: {
    label: "Completed",
    className: "border-emerald-200 bg-emerald-50 text-emerald-800",
  },
  cancelled: {
    label: "Cancelled",
    className: "border-slate-200 bg-slate-50 text-slate-600",
  },
};

const EMPTY_TITLE: Record<AdminVideoCallFilter, string> = {
  pending: "No video calls waiting to be scheduled",
  scheduled: "No scheduled video calls",
  completed: "No completed video calls yet",
  cancelled: "No cancelled video calls",
  all: "No video call requests yet",
};

export function AdminVideoCallsTable() {
  const { searchParams, setParams, page } = useTableParams();
  const requested = searchParams.get("status");
  const status =
    FILTERS.find((filter) => filter.value === requested)?.value ??
    FILTERS[0].value;

  const { data: counts } = useQuery(adminVideoCallCountsQueryOptions());
  const list = useQuery(adminVideoCallsQueryOptions({ status, page }));

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          Video call requests
        </h1>
        <p className="mt-1 text-gray-600">
          Paid one-to-one calls between a student and a mentor.
        </p>
      </div>

      <FilterTabs
        label="Status"
        options={FILTERS}
        value={status}
        counts={counts}
        onChange={(filter) => setParams({ status: filter, page: null })}
      />

      {!list.data || (list.isPlaceholderData && list.data.total === 0) ? (
        list.isError && !list.isPlaceholderData ? (
          <QueryErrorState
            title="Couldn't load video calls"
            error={list.error}
            onRetry={() => list.refetch()}
            isRetrying={list.isFetching}
          />
        ) : (
          <AdminTableSkeleton />
        )
      ) : list.data.total === 0 ? (
        <EmptyState icon={Video} title={EMPTY_TITLE[status]} />
      ) : (
        <div className="space-y-4">
          <div
            className={cn(
              "overflow-x-auto rounded-xl border border-slate-200 bg-white transition-opacity",
              list.isPlaceholderData && "opacity-60",
            )}
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Mentor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Requested</TableHead>
                  <TableHead>Scheduled for</TableHead>
                  <TableHead className="text-right">
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {list.data.items.map((call) => (
                  <VideoCallRow key={call.id} call={call} />
                ))}
              </TableBody>
            </Table>
          </div>
          <TablePagination
            page={list.data.page}
            requestedPage={page}
            pageCount={list.data.pageCount}
            total={list.data.total}
            pageSize={list.data.pageSize}
            onPage={(next) => setParams({ page: next === 1 ? null : next })}
          />
        </div>
      )}
    </div>
  );
}

function Person({
  person,
  href,
}: {
  person: AdminVideoCallRow["student"];
  href: string;
}) {
  return (
    <div className="min-w-44">
      <Link
        href={href}
        className="block truncate font-medium capitalize text-gray-900 hover:underline"
      >
        {person.name}
      </Link>
      <p className="truncate text-sm text-gray-500">{person.email}</p>
    </div>
  );
}

function VideoCallRow({ call }: { call: AdminVideoCallRow }) {
  const meta = call.status ? STATUS_META[call.status] : null;

  return (
    <TableRow>
      <TableCell>
        <Person person={call.student} href={`/admin/students/${call.student.id}`} />
      </TableCell>
      <TableCell>
        <Person person={call.mentor} href={`/admin/mentors/${call.mentor.id}`} />
      </TableCell>
      <TableCell>
        {meta ? (
          <Badge variant="outline" className={meta.className}>
            {meta.label}
          </Badge>
        ) : (
          "—"
        )}
      </TableCell>
      <TableCell className="whitespace-nowrap text-gray-700">
        {call.requestedAt ? format(call.requestedAt, "d MMM yyyy") : "—"}
      </TableCell>
      <TableCell className="whitespace-nowrap text-gray-700">
        {call.scheduledTime ? (
          <span className="inline-flex items-center gap-1">
            <CalendarClock className="size-3.5 text-gray-400" />
            {format(call.scheduledTime, "d MMM yyyy, h:mm a")}
          </span>
        ) : (
          "—"
        )}
      </TableCell>
      <TableCell className="text-right">
        {call.status === "pending" && (
          <Link
            href={`${ADMIN_VIDEO_CALLS_HREF}/schedule-video-call/${call.id}`}
            className="inline-flex items-center gap-1 text-sm font-medium text-emerald-700 hover:underline"
          >
            Schedule
            <ChevronRight className="size-4" />
          </Link>
        )}
      </TableCell>
    </TableRow>
  );
}
