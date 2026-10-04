import { Skeleton } from "@/components/ui/skeleton";
import {
  CardGridSkeleton,
  ListSkeleton,
  StatCardsSkeleton,
} from "@/components/data-states/skeletons";

// Page-shaped loading states for the dashboards. Each mirrors the layout of
// the page it stands in for, so nothing jumps when the data arrives.

function PageHeadingSkeleton({ action = false }: { action?: boolean }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-2">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-4 w-72 max-w-full" />
      </div>
      {action && <Skeleton className="h-9 w-32" />}
    </div>
  );
}

// The whole dashboard (sidebar + header + content) before its layout has
// rendered, e.g. when arriving from another part of the site.
export function DashboardShellSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading" className="flex min-h-svh">
      <div className="hidden w-64 shrink-0 flex-col gap-6 border-r bg-sidebar p-3 md:flex">
        <div className="flex items-center gap-2 p-2">
          <Skeleton className="size-8 rounded-lg" />
          <Skeleton className="h-4 w-24" />
        </div>
        {[4, 2, 3].map((rows, group) => (
          <div key={group} className="space-y-2 px-2">
            <Skeleton className="h-3 w-20" />
            {Array.from({ length: rows }, (_, i) => (
              <Skeleton key={i} className="h-8 w-full" />
            ))}
          </div>
        ))}
        <Skeleton className="mt-auto h-12 w-full" />
      </div>
      <div className="flex flex-1 flex-col">
        <div className="flex h-14 items-center gap-3 border-b px-4">
          <Skeleton className="size-7" />
          <Skeleton className="h-4 w-40" />
        </div>
        <div className="mx-auto w-full max-w-6xl p-4 md:p-6 lg:p-8">
          <MentorOverviewSkeleton />
        </div>
      </div>
    </div>
  );
}

export function MentorOverviewSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading" className="mx-auto max-w-6xl space-y-8">
      <PageHeadingSkeleton />
      <StatCardsSkeleton />
      <div className="space-y-3">
        <Skeleton className="h-5 w-40" />
        <ListSkeleton rows={2} />
      </div>
    </div>
  );
}

// Bookings / enquiries: heading, status tabs, then rows.
export function DashboardListPageSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading" className="mx-auto max-w-5xl space-y-6">
      <PageHeadingSkeleton />
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 5 }, (_, i) => (
          <Skeleton key={i} className="h-9 w-24 rounded-full" />
        ))}
      </div>
      <ListSkeleton rows={5} />
    </div>
  );
}

// Services: heading with "Add service", payment details card, service cards.
export function MentorServicesSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading" className="mx-auto max-w-5xl space-y-8">
      <PageHeadingSkeleton action />
      <div className="space-y-3 rounded-xl border border-slate-100 p-5">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-24 w-24" />
      </div>
      <CardGridSkeleton count={3} className="lg:grid-cols-2" />
    </div>
  );
}
