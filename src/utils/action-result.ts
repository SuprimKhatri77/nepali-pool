// Shared contract between server-action fetchers and TanStack Query.
//
// Fetchers return expected failures (unauthorised, not found, bad input) as
// a value instead of throwing, because Next.js replaces the message of an
// error thrown from a server action with a generic one in production.
// Query functions call `unwrap` to turn a failure back into a thrown
// `ActionError`, which the query reports as its `error`.

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; message: string };

// One page of a cursor-paginated list (useInfiniteQuery).
export type CursorPage<T> = { items: T[]; nextCursor: string | null };

// One numbered page of a table (page is 1-based, already clamped to range).
export type OffsetPage<T> = {
  items: T[];
  total: number;
  page: number;
  pageCount: number;
  pageSize: number;
};

// A failure the server reported on purpose; its message is safe to show.
export class ActionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ActionError";
  }
}

export function unwrap<T>(result: ActionResult<T>): T {
  if (!result.success) throw new ActionError(result.message);
  return result.data;
}
