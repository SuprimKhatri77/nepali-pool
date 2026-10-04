"use client";

import { RotateCw, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/components/lib/utils";
import { ActionError } from "@/utils/action-result";

const FALLBACK_MESSAGE =
  "Something went wrong while loading this. Please try again.";

// Error state for a failed query. Only messages the server chose to send
// (ActionError) are shown; anything else gets a generic message so internal
// errors never reach the page.
export function QueryErrorState({
  error,
  onRetry,
  isRetrying = false,
  title = "Couldn't load this",
  className,
}: {
  error: Error | null;
  onRetry?: () => void;
  isRetrying?: boolean;
  title?: string;
  className?: string;
}) {
  const message =
    error instanceof ActionError ? error.message : FALLBACK_MESSAGE;

  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-xl border border-red-100 bg-red-50/50 px-6 py-10 text-center",
        className,
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
        <TriangleAlert className="h-6 w-6" />
      </div>
      <div className="space-y-1">
        <h3 className="font-semibold text-slate-900">{title}</h3>
        <p className="text-sm text-slate-600">{message}</p>
      </div>
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          disabled={isRetrying}
        >
          <RotateCw className={cn(isRetrying && "animate-spin")} />
          {isRetrying ? "Retrying..." : "Try again"}
        </Button>
      )}
    </div>
  );
}
