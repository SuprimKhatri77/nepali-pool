import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/components/lib/utils";

// Rows of a list or table while its query is pending.
export function ListSkeleton({
  rows = 5,
  className,
}: {
  rows?: number;
  className?: string;
}) {
  return (
    <div
      aria-busy="true"
      aria-label="Loading"
      className={cn("space-y-3", className)}
    >
      {Array.from({ length: rows }, (_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 rounded-xl border border-slate-100 p-4"
        >
          <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-2/3" />
          </div>
          <Skeleton className="h-8 w-20 shrink-0" />
        </div>
      ))}
    </div>
  );
}

// A grid of cards (mentors, services) while its query is pending.
export function CardGridSkeleton({
  count = 6,
  className,
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div
      aria-busy="true"
      aria-label="Loading"
      className={cn(
        "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
        className,
      )}
    >
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className="space-y-4 rounded-xl border border-slate-100 p-5"
        >
          <div className="flex items-center gap-3">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-3 w-1/3" />
            </div>
          </div>
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-4/5" />
          <Skeleton className="h-9 w-full" />
        </div>
      ))}
    </div>
  );
}

// Dashboard stat cards while the overview query is pending.
export function StatCardsSkeleton({
  count = 4,
  className,
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div
      aria-busy="true"
      aria-label="Loading"
      className={cn("grid grid-cols-2 gap-4 lg:grid-cols-4", className)}
    >
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className="space-y-3 rounded-xl border border-slate-100 p-5"
        >
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-8 w-1/3" />
        </div>
      ))}
    </div>
  );
}
