"use client";

import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ChevronRight, Users } from "lucide-react";
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
  adminMentorCountsQueryOptions,
  adminMentorsQueryOptions,
} from "@/modules/admin-dashboard/queries";
import type {
  AdminMentorFilter,
  AdminMentorRow,
} from "../../../../server/actions/admin-dashboard/people";
import { FilterTabs } from "@/components/dashboard/filter-tabs";
import { ADMIN_MENTOR_APPLICATIONS_HREF } from "./routes";
import { TablePagination } from "./table-pagination";
import { TableSearch } from "./table-search";
import { useTableParams } from "@/components/dashboard/use-table-params";

const STATUS_META: Record<
  NonNullable<AdminMentorRow["verifiedStatus"]>,
  { label: string; className: string }
> = {
  pending: {
    label: "Pending",
    className: "border-amber-200 bg-amber-50 text-amber-800",
  },
  accepted: {
    label: "Approved",
    className: "border-emerald-200 bg-emerald-50 text-emerald-800",
  },
  rejected: {
    label: "Rejected",
    className: "border-red-200 bg-red-50 text-red-700",
  },
};

const FILTER_LABEL: Record<AdminMentorFilter, string> = {
  all: "All",
  pending: "Pending",
  accepted: "Approved",
  rejected: "Rejected",
};

const VARIANTS = {
  directory: {
    title: "Mentors",
    description: "Every mentor profile, whatever its review status.",
    // Tab order; the first one is the default.
    filters: ["all", "accepted", "pending", "rejected"],
  },
  applications: {
    title: "Mentor applications",
    description: "Review new mentors before they appear on the site.",
    filters: ["pending", "rejected"],
  },
} satisfies Record<
  string,
  { title: string; description: string; filters: AdminMentorFilter[] }
>;

// Approved mentors open their profile; anyone else opens the review page,
// where they can be approved or rejected.
function rowLink(mentor: AdminMentorRow) {
  return mentor.verifiedStatus === "accepted"
    ? { href: `/admin/mentors/${mentor.userId}`, label: "View" }
    : {
        href: `${ADMIN_MENTOR_APPLICATIONS_HREF}/${mentor.userId}`,
        label: "Review",
      };
}

export function AdminMentorsTable({
  variant,
}: {
  variant: keyof typeof VARIANTS;
}) {
  const { title, description } = VARIANTS[variant];
  const filters: AdminMentorFilter[] = VARIANTS[variant].filters;
  const { searchParams, setParams, q, page } = useTableParams();
  const requested = searchParams.get("status");
  const status =
    filters.find((filter) => filter === requested) ?? filters[0];

  const { data: counts } = useQuery(adminMentorCountsQueryOptions());
  const list = useQuery(adminMentorsQueryOptions({ status, q, page }));

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          {title}
        </h1>
        <p className="mt-1 text-gray-600">{description}</p>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <FilterTabs
          label="Status"
          options={filters.map((filter) => ({
            value: filter,
            label: FILTER_LABEL[filter],
          }))}
          value={status}
          counts={counts}
          onChange={(filter) => setParams({ status: filter, page: null })}
        />
        <TableSearch
          value={q}
          onSearch={(text) => setParams({ q: text, page: null }, { replace: true })}
          placeholder="Search name, email, city, country"
        />
      </div>

      {!list.data || (list.isPlaceholderData && list.data.total === 0) ? (
        // Only before the first page: afterwards the previous page stays up
        // while the next one loads, and a failed refetch keeps it too.
        list.isError && !list.isPlaceholderData ? (
          <QueryErrorState
            title="Couldn't load mentors"
            error={list.error}
            onRetry={() => list.refetch()}
            isRetrying={list.isFetching}
          />
        ) : (
          <AdminTableSkeleton />
        )
      ) : list.data.total === 0 ? (
        <EmptyState
          icon={Users}
          title={q ? `No mentors match "${q}"` : "No mentors here yet"}
          description={q ? "Try a different name, email or place." : undefined}
        />
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
                  <TableHead>Mentor</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Applied</TableHead>
                  <TableHead className="text-right">
                    <span className="sr-only">Open</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {list.data.items.map((mentor) => (
                  <MentorRow key={mentor.userId} mentor={mentor} />
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

function MentorRow({ mentor }: { mentor: AdminMentorRow }) {
  const { href, label } = rowLink(mentor);
  const meta = mentor.verifiedStatus ? STATUS_META[mentor.verifiedStatus] : null;
  const location = [mentor.city, mentor.country].filter(Boolean).join(", ");

  return (
    <TableRow>
      <TableCell>
        <div className="flex min-w-56 items-center gap-3">
          <Avatar name={mentor.name} imageUrl={mentor.imageUrl} />
          <div className="min-w-0">
            <Link
              href={href}
              className="block truncate font-medium capitalize text-gray-900 hover:underline"
            >
              {mentor.name}
            </Link>
            <p className="truncate text-sm text-gray-500">{mentor.email}</p>
          </div>
        </div>
      </TableCell>
      <TableCell className="capitalize text-gray-700">
        {location || "—"}
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
        {mentor.appliedAt ? format(mentor.appliedAt, "d MMM yyyy") : "—"}
      </TableCell>
      <TableCell className="text-right">
        <Link
          href={href}
          className="inline-flex items-center gap-1 text-sm font-medium text-emerald-700 hover:underline"
        >
          {label}
          <ChevronRight className="size-4" />
        </Link>
      </TableCell>
    </TableRow>
  );
}

export function Avatar({
  name,
  imageUrl,
}: {
  name: string;
  imageUrl: string | null;
}) {
  return (
    <div className="relative size-9 shrink-0 overflow-hidden rounded-full bg-slate-100">
      {imageUrl ? (
        <Image src={imageUrl} alt="" fill sizes="36px" className="object-cover" />
      ) : (
        <span className="flex size-full items-center justify-center text-sm font-semibold text-emerald-700">
          {name.charAt(0).toUpperCase()}
        </span>
      )}
    </div>
  );
}
