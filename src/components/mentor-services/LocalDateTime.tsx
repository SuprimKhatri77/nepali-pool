"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

// Formats in the viewer's timezone. Renders nothing on the server so the
// server's timezone never leaks into the HTML (and no hydration mismatch).
export function LocalDateTime({ value }: { value: Date | string }) {
  const isClient = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const date = new Date(value);
  return (
    <time dateTime={date.toISOString()}>
      {isClient
        ? date.toLocaleString(undefined, {
            dateStyle: "medium",
            timeStyle: "short",
          })
        : null}
    </time>
  );
}
