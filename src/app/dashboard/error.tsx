"use client";

import { useEffect } from "react";
import Link from "next/link";
import { House, RotateCw, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

// Shown when a dashboard page throws while rendering. The error's message is
// never printed: in production it's a generic digest, in dev it may be
// internal detail.
export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      role="alert"
      className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center"
    >
      <div className="flex size-14 items-center justify-center rounded-full bg-red-100 text-red-600">
        <TriangleAlert className="size-7" />
      </div>
      <div className="space-y-1">
        <h1 className="text-xl font-semibold text-gray-900">
          Something went wrong
        </h1>
        <p className="text-sm text-gray-600">
          This page couldn&apos;t be loaded. Please try again.
        </p>
      </div>
      <div className="flex gap-2">
        <Button onClick={reset}>
          <RotateCw />
          Try again
        </Button>
        <Button asChild variant="outline">
          <Link href="/">
            <House />
            Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
