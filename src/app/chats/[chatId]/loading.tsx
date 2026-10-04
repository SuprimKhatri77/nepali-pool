import { Skeleton } from "@/components/ui/skeleton";
import { ThreadSkeleton } from "@/components/chat/chat-thread";

// Header with the other person, message bubbles, then the composer.
export default function Loading() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading"
      className="flex h-[calc(100svh-5.5rem)] flex-col overflow-hidden rounded-xl border border-gray-100 bg-white"
    >
      <div className="flex items-center gap-3 border-b border-gray-100 px-3 py-4 sm:px-5">
        <Skeleton className="size-10 rounded-full sm:size-12" />
        <Skeleton className="h-5 w-40" />
      </div>
      <div className="flex flex-1 flex-col justify-end px-2 sm:px-4">
        <ThreadSkeleton />
      </div>
      <div className="flex items-center gap-2 border-t border-gray-100 px-3 py-3">
        <Skeleton className="size-10 rounded-full" />
        <Skeleton className="h-10 flex-1 rounded-full" />
      </div>
    </div>
  );
}
