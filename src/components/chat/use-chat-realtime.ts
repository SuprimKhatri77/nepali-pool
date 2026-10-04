"use client";

import { useEffect, useEffectEvent } from "react";
import { createClient } from "../../../server/utlis/supabase/client";

const FALLBACK_POLL_MS = 15_000;

// Calls `onChange` whenever this chat might have new messages: a message
// row was inserted, the tab became visible again, or the realtime
// connection (re)connected after possibly missing events. While realtime
// isn't connected (blocked, down, timed out) it polls instead.
//
// The realtime payload is only used as a signal. Messages themselves are
// always fetched through the access-checked server action, so nothing here
// depends on what the realtime feed carries.
export function useChatRealtime(chatId: string, onChange: () => void) {
  const notify = useEffectEvent(onChange);

  useEffect(() => {
    const supabase = createClient();
    let poll: ReturnType<typeof setInterval> | null = null;
    const startPolling = () => {
      poll ??= setInterval(() => notify(), FALLBACK_POLL_MS);
    };
    const stopPolling = () => {
      if (poll) clearInterval(poll);
      poll = null;
    };
    // Poll until realtime says it's connected.
    startPolling();

    // A unique topic: supabase-js hands back an existing channel with the
    // same name, and one still leaving from a quick remount never resubscribes.
    const channel = supabase
      .channel(`chat-${chatId}-${crypto.randomUUID()}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `chat_id=eq.${chatId}`,
        },
        () => notify(),
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          stopPolling();
          notify();
        } else {
          startPolling();
        }
      });

    const onVisible = () => {
      if (document.visibilityState === "visible") notify();
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      stopPolling();
      supabase.removeChannel(channel);
    };
  }, [chatId]);
}
