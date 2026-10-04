"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/data-states/empty-state";
import { QueryErrorState } from "@/components/data-states/query-error-state";
import { CardGridSkeleton } from "@/components/data-states/skeletons";
import { favoriteMentorsQueryOptions } from "@/modules/student-dashboard/queries";
import { STUDENT_DASHBOARD_HREF } from "./student-dashboard-shell";
import { StudentMentorCard } from "./student-mentor-card";

export function StudentFavorites() {
  const { data, error, isError, refetch, isFetching } = useQuery(
    favoriteMentorsQueryOptions(),
  );

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          Favorites
        </h1>
        <p className="mt-1 text-gray-600">
          Mentors you&apos;ve saved to come back to.
        </p>
      </div>

      {!data ? (
        // A failed background refetch keeps showing the data we have.
        isError ? (
          <QueryErrorState
            title="Couldn't load your favorites"
            error={error}
            onRetry={() => refetch()}
            isRetrying={isFetching}
          />
        ) : (
          <CardGridSkeleton count={6} />
        )
      ) : data.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="No favorites yet"
          description="Tap the heart on a mentor to save them here."
          action={
            <Button asChild variant="outline">
              <Link href={STUDENT_DASHBOARD_HREF}>See matching mentors</Link>
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((mentor) => (
            <StudentMentorCard key={mentor.userId} mentor={mentor} />
          ))}
        </div>
      )}
    </div>
  );
}
