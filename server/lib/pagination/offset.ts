import "server-only";

import { ilike, or, type AnyColumn, type SQL } from "drizzle-orm";

// Numbered pages for admin tables, where a total and "page x of y" matter
// more than keyset stability.

export const TABLE_PAGE_SIZE = 20;

// Pages are 1-based; a page past the end shows the last one, so any page
// number from a URL is safe to pass in.
export function clampPage(page: number, total: number) {
  const pageCount = Math.max(1, Math.ceil(total / TABLE_PAGE_SIZE));
  const current = Math.min(Math.max(1, page), pageCount);
  return {
    page: current,
    pageCount,
    offset: (current - 1) * TABLE_PAGE_SIZE,
  };
}

// Case-insensitive "contains" over several columns. %, _ and \ in the
// search text are matched literally rather than as LIKE wildcards.
export function searchColumns(q: string, columns: AnyColumn[]): SQL | undefined {
  const text = q.trim();
  if (!text) return undefined;
  const pattern = `%${text.replace(/[\\%_]/g, (c) => `\\${c}`)}%`;
  return or(...columns.map((column) => ilike(column, pattern)));
}
