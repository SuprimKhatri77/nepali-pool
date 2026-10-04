"use client";

import Link from "next/link";
import { useInfiniteQuery } from "@tanstack/react-query";
import { MapPin, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/data-states/empty-state";
import { LoadMore } from "@/components/data-states/load-more";
import { QueryErrorState } from "@/components/data-states/query-error-state";
import { CardGridSkeleton } from "@/components/data-states/skeletons";
import { matchingMentorsInfiniteOptions } from "@/modules/student-dashboard/queries";
import { StudentMentorCard } from "./student-mentor-card";

function listCountries(countries: string[]) {
  if (countries.length <= 1) return countries.join("");
  return `${countries.slice(0, -1).join(", ")} and ${countries.at(-1)}`;
}

export function StudentOverview({
  firstName,
  destinations,
}: {
  firstName: string;
  destinations: string[];
}) {
  const list = useInfiniteQuery({
    ...matchingMentorsInfiniteOptions(),
    enabled: destinations.length > 0,
  });
  // Offset pages: drop a repeat if a mentor was approved mid-scroll.
  const seen = new Set<string>();
  const mentors = (list.data?.pages ?? [])
    .flatMap((page) => page.items)
    .filter((mentor) => !seen.has(mentor.userId) && !!seen.add(mentor.userId));

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          Welcome back, {firstName}
        </h1>
        <p className="mt-1 text-gray-600">
          {destinations.length > 0 ? (
            <>
              Mentors in{" "}
              <span className="capitalize">{listCountries(destinations)}</span>,
              where you want to study.
            </>
          ) : (
            "Find mentors who've studied where you want to go."
          )}
        </p>
      </div>

      {destinations.length === 0 ? (
        <EmptyState
          icon={MapPin}
          title="Add your study destinations"
          description="Tell us which countries you're considering and we'll show mentors there."
          action={
            <Button asChild variant="outline">
              <Link href="/profile">Update profile</Link>
            </Button>
          }
        />
      ) : !list.data ? (
        // Only before the first page arrives: once there's data, a failed
        // refetch or next page keeps the list (LoadMore shows its own retry).
        list.isError ? (
          <QueryErrorState
            title="Couldn't load mentors"
            error={list.error}
            onRetry={() => list.refetch()}
            isRetrying={list.isFetching}
          />
        ) : (
          <CardGridSkeleton count={6} />
        )
      ) : mentors.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title="No mentors there yet"
          description="New mentors join every week. Meanwhile, browse everyone."
          action={
            <Button asChild variant="outline">
              <Link href="/mentors">Browse all mentors</Link>
            </Button>
          }
        />
      ) : (
        <div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {mentors.map((mentor) => (
              <StudentMentorCard key={mentor.userId} mentor={mentor} />
            ))}
          </div>
          <LoadMore
            hasNextPage={list.hasNextPage}
            isFetchingNextPage={list.isFetchingNextPage}
            isFetchNextPageError={list.isFetchNextPageError}
            fetchNextPage={list.fetchNextPage}
            skeleton={<CardGridSkeleton count={3} />}
          />
        </div>
      )}
    </div>
  );
}
