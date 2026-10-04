import { useCallback, useEffect, useRef } from "react";
import {
  infiniteQueryOptions,
  queryOptions,
  useMutation,
  useQueryClient,
  type InfiniteData,
  type QueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { ActionError, unwrap, type CursorPage } from "@/utils/action-result";
import { listMyChats } from "../../../server/actions/chats/list";
import {
  listChatMessages,
  listNewChatMessages,
  sendChatMessage,
  type ChatMessage,
} from "../../../server/actions/chats/messages";

export const chatKeys = {
  all: ["chats"] as const,
  list: () => [...chatKeys.all, "list"] as const,
  messages: (chatId: string) => [...chatKeys.all, "messages", chatId] as const,
};

export const myChatsQueryOptions = () =>
  queryOptions({
    queryKey: chatKeys.list(),
    queryFn: async () => unwrap(await listMyChats()),
  });

// Pages run newest first: page 0 holds the latest messages and each next
// page goes further back in time.
export const chatMessagesInfiniteOptions = (chatId: string) =>
  infiniteQueryOptions({
    queryKey: chatKeys.messages(chatId),
    queryFn: async ({ pageParam }) =>
      unwrap(await listChatMessages({ chatId, cursor: pageParam })),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    // New messages arrive through realtime / sync, not by refetching every
    // loaded page.
    staleTime: Infinity,
  });

type MessagePages = InfiniteData<CursorPage<ChatMessage>, string | null>;

// Cursors are fixed-width `<UTC timestamp>_<uuid>`, so comparing them as
// strings orders messages exactly like the database does.
const newestFirst = (a: ChatMessage, b: ChatMessage) =>
  a.cursor < b.cursor ? 1 : a.cursor > b.cursor ? -1 : 0;

// Adds messages to the newest page, skipping any already loaded. Returns how
// many were new.
function mergeIntoCache(
  queryClient: QueryClient,
  chatId: string,
  incoming: ChatMessage[],
): number {
  let added = 0;
  queryClient.setQueryData<MessagePages>(chatKeys.messages(chatId), (data) => {
    if (!data || incoming.length === 0) return data;
    const known = new Set(
      data.pages.flatMap((page) => page.items.map((message) => message.id)),
    );
    const fresh = incoming.filter((message) => !known.has(message.id));
    added = fresh.length;
    if (fresh.length === 0) return data;
    const [first, ...rest] = data.pages;
    return {
      ...data,
      pages: [
        { ...first, items: [...fresh, ...first.items].sort(newestFirst) },
        ...rest,
      ],
    };
  });
  return added;
}

const SYNC_RETRY_DELAYS_MS = [2_000, 5_000, 15_000];

// Pulls in whatever is new since the newest loaded message. Calls that come
// in while one is running are folded into a single follow-up run; a failed
// run (offline, server error) is retried with backoff.
export function useSyncNewMessages(chatId: string) {
  const queryClient = useQueryClient();
  const running = useRef(false);
  const again = useRef(false);
  const failures = useRef(0);
  const retryTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // No retries for a chat that's no longer on screen.
  useEffect(
    () => () => {
      if (retryTimer.current) clearTimeout(retryTimer.current);
    },
    [],
  );

  const sync = useCallback(async (): Promise<void> => {
    if (running.current) {
      again.current = true;
      return;
    }
    running.current = true;
    if (retryTimer.current) {
      clearTimeout(retryTimer.current);
      retryTimer.current = null;
    }
    let added = 0;
    try {
      do {
        again.current = false;
        const data = queryClient.getQueryData<MessagePages>(
          chatKeys.messages(chatId),
        );
        // Nothing loaded yet: the initial fetch brings everything, and the
        // thread syncs once it has.
        if (!data) break;
        const newest = data.pages[0]?.items[0];
        if (!newest) {
          // An empty chat has no anchor to sync from; just reload it.
          await queryClient.invalidateQueries({
            queryKey: chatKeys.messages(chatId),
          });
          continue;
        }
        const result = await listNewChatMessages({
          chatId,
          since: newest.cursor,
        });
        // Not allowed any more (chat gone, signed out): nothing to retry.
        if (!result.success) break;
        if (!result.data.complete) {
          // Too much happened while away: start over from the latest page.
          await queryClient.resetQueries({ queryKey: chatKeys.messages(chatId) });
          added += 1;
          continue;
        }
        added += mergeIntoCache(queryClient, chatId, result.data.items);
      } while (again.current);
      failures.current = 0;
    } catch {
      // Offline, a server error or a redeploy: try again shortly.
      const delay =
        SYNC_RETRY_DELAYS_MS[
          Math.min(failures.current, SYNC_RETRY_DELAYS_MS.length - 1)
        ];
      failures.current += 1;
      retryTimer.current = setTimeout(() => void sync(), delay);
    } finally {
      running.current = false;
    }
    // A new message also moves this chat to the top of the list.
    if (added > 0) {
      queryClient.invalidateQueries({ queryKey: chatKeys.list() });
    }
    // Something asked for a sync while this one was finishing up.
    if (again.current) void sync();
  }, [chatId, queryClient]);

  return sync;
}

export type OutgoingFile = { url: string; type: string; name: string };

// Sending puts the server's copy of the message straight into the thread, so
// the sender doesn't wait for realtime to see it.
export function useSendChatMessage(chatId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (vars: { text: string; files: OutgoingFile[] }) =>
      unwrap(await sendChatMessage({ chatId, ...vars })),
    onSuccess: (message) => {
      mergeIntoCache(queryClient, chatId, [message]);
      queryClient.invalidateQueries({ queryKey: chatKeys.list() });
    },
    onError: (error) =>
      toast.error(
        error instanceof ActionError
          ? error.message
          : "Couldn't send your message. Please try again.",
      ),
  });
}
