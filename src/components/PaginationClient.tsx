// components/PaginationClient.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { cn } from "./lib/utils";
import { useEffect } from "react";

export function PaginationClient({
  totalPages,
  scrollTarget = "body",
}: {
  totalPages: number;
  scrollTarget: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;

  const goToPage = (p: number) => {
    router.push(`?page=${p}`);
  };

  useEffect(() => {
    const el =
      scrollTarget === "body"
        ? document.documentElement
        : document.querySelector(scrollTarget);

    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [page, scrollTarget]);

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <Button
            variant="ghost"
            disabled={page === 1}
            className="disabled:opacity-50"
            onClick={() => goToPage(page - 1)}
          >
            <PaginationPrevious />
          </Button>
        </PaginationItem>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <PaginationItem key={p}>
            <PaginationLink
              isActive={p === page}
              className={cn(
                "cursor-default",
                p === page
                  ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-300"
                  : "hover:bg-slate-50"
              )}
              onClick={() => goToPage(p)}
            >
              {p}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem>
          <Button
            variant="ghost"
            disabled={page === totalPages}
            className="disabled:opacity-50"
            onClick={() => goToPage(page + 1)}
          >
            <PaginationNext />
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
