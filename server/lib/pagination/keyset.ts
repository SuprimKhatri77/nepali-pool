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

// Columns are `timestamptz` by default. `naive: true` is for a `timestamp
// without time zone` column that holds UTC wall time (e.g. messages).
type TimestampKind = { naive?: boolean };

// Select this alongside each row; it becomes the next cursor.
export function cursorTimestamp(
  createdAt: AnyColumn,
  { naive = false }: TimestampKind = {},
) {
  return naive
    ? sql<string>`to_char(${createdAt}, 'YYYY-MM-DD"T"HH24:MI:SS.US"Z"')`
    : sql<string>`to_char(${createdAt} at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.US"Z"')`;
}

function cursorValue(cursor: Cursor, { naive = false }: TimestampKind) {
  return naive
    ? sql`(${cursor.createdAt}::timestamptz at time zone 'UTC')`
    : sql`${cursor.createdAt}::timestamptz`;
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
  kind: TimestampKind = {},
): SQL {
  return sql`(${createdAt}, ${id}) < (${cursorValue(cursor, kind)}, ${cursor.id}::uuid)`;
}

// Rows created at or after `seconds` before the cursor: a live tail ("what's
// new since the newest row I have"). The overlap catches rows from
// transactions that started earlier but committed later, which a strict
// "newer than" would skip for good; callers drop the ones they already have.
export function sinceCursor(
  createdAt: AnyColumn,
  cursor: Cursor,
  seconds: number,
  kind: TimestampKind = {},
): SQL {
  return sql`${createdAt} >= ${cursorValue(cursor, kind)} - make_interval(secs => ${seconds})`;
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
