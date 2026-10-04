import "server-only";

import { sql, type AnyColumn, type SQL } from "drizzle-orm";
import type { CursorPage } from "../../../src/utils/action-result";

// Keyset ("load more") pagination over (created_at DESC, id DESC).
//
// The cursor is `<created_at>_<id>` where created_at is printed by Postgres
// in UTC with microseconds. A JS Date only keeps milliseconds, so a cursor
// built from one could skip rows created within the same millisecond.

export const PAGE_SIZE = 20;

const CURSOR_RE =
  /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{6}Z)_([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/;

type Cursor = { createdAt: string; id: string };

// Select this alongside each row; it becomes the next cursor.
export function cursorTimestamp(createdAt: AnyColumn) {
  return sql<string>`to_char(${createdAt} at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.US"Z"')`;
}

// null = first page; "invalid" = a cursor this server never issued.
export function parseCursor(cursor: string | null): Cursor | null | "invalid" {
  if (cursor === null) return null;
  const match = CURSOR_RE.exec(cursor);
  return match ? { createdAt: match[1], id: match[2] } : "invalid";
}

// Rows strictly after the cursor in (created_at DESC, id DESC) order.
export function afterCursor(
  createdAt: AnyColumn,
  id: AnyColumn,
  cursor: Cursor,
): SQL {
  return sql`(${createdAt}, ${id}) < (${cursor.createdAt}::timestamptz, ${cursor.id}::uuid)`;
}

// Query PAGE_SIZE + 1 rows; the extra one only tells us there's a next page.
export function toCursorPage<R extends { cursorTs: string }, T>(
  rows: R[],
  idOf: (row: R) => string,
  toItem: (row: R) => T,
): CursorPage<T> {
  const pageRows = rows.slice(0, PAGE_SIZE);
  const last = pageRows.at(-1);
  return {
    items: pageRows.map(toItem),
    nextCursor:
      rows.length > PAGE_SIZE && last ? `${last.cursorTs}_${idOf(last)}` : null,
  };
}
