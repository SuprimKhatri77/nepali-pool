import { Skeleton } from "@/components/ui/skeleton";
import { CardGridSkeleton } from "@/components/data-states/skeletons";

// Heading, status tabs, then call cards.
export default function Loading() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading"
      className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6"
    >
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72 max-w-full" />
      </div>
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-9 w-24 rounded-full" />
        ))}
      </div>
      <CardGridSkeleton count={3} />
    </div>
  );
}
