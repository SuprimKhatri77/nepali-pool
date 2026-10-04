"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ChevronRight, GraduationCap } from "lucide-react";
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
import { adminStudentsQueryOptions } from "@/modules/admin-dashboard/queries";
import type { AdminStudentRow } from "../../../../server/actions/admin-dashboard/people";
import { Avatar } from "./admin-mentors-table";
import { TablePagination } from "./table-pagination";
import { TableSearch } from "./table-search";
import { useTableParams } from "@/components/dashboard/use-table-params";

export function AdminStudentsTable() {
  const { setParams, q, page } = useTableParams();
  const list = useQuery(adminStudentsQueryOptions({ q, page }));

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Students
          </h1>
          <p className="mt-1 text-gray-600">
            Everyone with a student profile.
          </p>
        </div>
        <TableSearch
          value={q}
          onSearch={(text) => setParams({ q: text, page: null }, { replace: true })}
          placeholder="Search name, email, city, district"
        />
      </div>

      {!list.data || (list.isPlaceholderData && list.data.total === 0) ? (
        list.isError && !list.isPlaceholderData ? (
          <QueryErrorState
            title="Couldn't load students"
            error={list.error}
            onRetry={() => list.refetch()}
            isRetrying={list.isFetching}
          />
        ) : (
          <AdminTableSkeleton />
        )
      ) : list.data.total === 0 ? (
        <EmptyState
          icon={GraduationCap}
          title={q ? `No students match "${q}"` : "No students yet"}
          description={
            q ? "Try a different name, email or place." : undefined
          }
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
                  <TableHead>Student</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Destinations</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">
                    <span className="sr-only">Open</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {list.data.items.map((student) => (
                  <StudentRow key={student.userId} student={student} />
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

function StudentRow({ student }: { student: AdminStudentRow }) {
  const href = `/admin/students/${student.userId}`;
  const location = [student.city, student.district].filter(Boolean).join(", ");
  const destinations = student.favoriteDestination ?? [];

  return (
    <TableRow>
      <TableCell>
        <div className="flex min-w-56 items-center gap-3">
          <Avatar name={student.name} imageUrl={student.imageUrl} />
          <div className="min-w-0">
            <Link
              href={href}
              className="block truncate font-medium capitalize text-gray-900 hover:underline"
            >
              {student.name}
            </Link>
            <p className="truncate text-sm text-gray-500">{student.email}</p>
          </div>
        </div>
      </TableCell>
      <TableCell className="capitalize text-gray-700">
        {location || "—"}
      </TableCell>
      <TableCell className="text-gray-700">
        {destinations.length > 0 ? destinations.join(", ") : "—"}
      </TableCell>
      <TableCell className="whitespace-nowrap text-gray-700">
        {student.joinedAt ? format(student.joinedAt, "d MMM yyyy") : "—"}
      </TableCell>
      <TableCell className="text-right">
        <Link
          href={href}
          className="inline-flex items-center gap-1 text-sm font-medium text-emerald-700 hover:underline"
        >
          View
          <ChevronRight className="size-4" />
        </Link>
      </TableCell>
    </TableRow>
  );
}
