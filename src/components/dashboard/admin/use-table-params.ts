"use client";

import { useCallback } from "react";
import { usePathname, useSearchParams } from "next/navigation";

// Table state (filter, search, page) lives in the URL so it survives a
// reload and can be shared. Updates go through the History API, which
// useSearchParams follows, so the table refetches on the client without a
// server round trip for the page itself.
export function useTableParams() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Built from window.location, not the rendered searchParams: Next applies
  // a history update in a transition, so a second update made before that
  // commits (a tab click right after the search debounce) would otherwise
  // start from stale params and drop the first one.
  const setParams = useCallback(
    (
      changes: Record<string, string | number | null>,
      { replace = false }: { replace?: boolean } = {},
    ) => {
      const next = new URLSearchParams(window.location.search);
      for (const [key, value] of Object.entries(changes)) {
        if (value === null || value === "") next.delete(key);
        else next.set(key, String(value));
      }
      const query = next.toString();
      const url = query ? `${pathname}?${query}` : pathname;
      if (replace) window.history.replaceState(null, "", url);
      else window.history.pushState(null, "", url);
    },
    [pathname],
  );

  const page = Number(searchParams.get("page"));
  return {
    searchParams,
    setParams,
    q: (searchParams.get("q") ?? "").slice(0, 100),
    // The server clamps a page past the end; this only rejects junk.
    page: Number.isSafeInteger(page) && page >= 1 ? page : 1,
  };
}
