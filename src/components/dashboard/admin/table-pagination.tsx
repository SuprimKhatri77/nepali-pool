"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

// `page` is the page the rows on screen belong to; `requestedPage` is the
// one in the URL, which runs ahead while the next page loads. Steps go from
// the requested page so a quick double click moves two pages, not one, and
// the buttons stay enabled (and focused) while loading.
export function TablePagination({
  page,
  requestedPage,
  pageCount,
  total,
  pageSize,
  onPage,
}: {
  page: number;
  requestedPage: number;
  pageCount: number;
  total: number;
  pageSize: number;
  onPage: (page: number) => void;
}) {
  const current = Math.min(requestedPage, pageCount);
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
    <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
      <p className="text-sm text-gray-600" aria-live="polite">
        Showing <span className="font-medium text-gray-900">{from}</span>
        {"–"}
        <span className="font-medium text-gray-900">{to}</span> of{" "}
        <span className="font-medium text-gray-900">{total}</span>
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={current <= 1}
          onClick={() => onPage(current - 1)}
        >
          <ChevronLeft className="size-4" />
          Previous
        </Button>
        <span className="text-sm text-gray-600">
          Page {current} of {pageCount}
        </span>
        <Button
          variant="outline"
          size="sm"
          disabled={current >= pageCount}
          onClick={() => onPage(current + 1)}
        >
          Next
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
