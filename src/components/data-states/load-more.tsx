"use client";

import { useEffect, useRef } from "react";
import { RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/components/lib/utils";

// Footer for a useInfiniteQuery list: loads the next page when it scrolls
// into view, with a button as the keyboard / no-IntersectionObserver
// fallback. Pass the matching fields of the infinite query result, and the
// list's own skeleton rows to show while the next page loads.
export function LoadMore({
  hasNextPage,
  isFetchingNextPage,
  isFetchNextPageError,
  fetchNextPage,
  skeleton,
  className,
}: {
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  isFetchNextPageError: boolean;
  fetchNextPage: () => unknown;
  // e.g. <ListSkeleton rows={3} />, shaped like the items being loaded
  skeleton: React.ReactNode;
  className?: string;
}) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  // After a failed page, wait for an explicit retry; otherwise the sentinel,
  // still on screen, would re-request in a loop.
  const autoLoad = hasNextPage && !isFetchingNextPage && !isFetchNextPageError;

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!autoLoad || !sentinel || typeof IntersectionObserver === "undefined") {
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          fetchNextPage();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [autoLoad, fetchNextPage]);

  if (!hasNextPage) return null;

  return (
    <div ref={sentinelRef} className={cn("py-6", className)}>
      {isFetchingNextPage ? (
        skeleton
      ) : (
        <div className="flex flex-col items-center gap-2">
          {isFetchNextPageError && (
            <p role="alert" className="text-sm text-red-600">
              Couldn&apos;t load more.
            </p>
          )}
          <Button variant="outline" size="sm" onClick={() => fetchNextPage()}>
            {isFetchNextPageError && <RotateCw />}
            {isFetchNextPageError ? "Try again" : "Load more"}
          </Button>
        </div>
      )}
    </div>
  );
}
