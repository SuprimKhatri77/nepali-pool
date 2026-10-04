"use client";

import {
  useEffect,
  useEffectEvent,
  useLayoutEffect,
  useMemo,
  useRef,
} from "react";
import Image from "next/image";
import { useInfiniteQuery } from "@tanstack/react-query";
import { MessageCircle, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { QueryErrorState } from "@/components/data-states/query-error-state";
import { PaymentButton } from "@/components/PaymentButton";
import {
  chatMessagesInfiniteOptions,
  useSyncNewMessages,
} from "@/modules/chats/queries";
import { ChatComposer } from "./chat-composer";
import { MessageBubble } from "./message-bubble";
import { useChatRealtime } from "./use-chat-realtime";

// Within this many pixels of the bottom counts as "reading the latest", so
// new messages scroll into view instead of jumping out from under you.
const NEAR_BOTTOM_PX = 120;

export type ChatThreadProps = {
  chatId: string;
  role: "student" | "mentor";
  viewer: { id: string; email: string };
  active: boolean;
  mentorId: string;
  other: { name: string; imageUrl: string | null };
};

export function ChatThread(props: ChatThreadProps) {
  const { other } = props;

  return (
    <div className="flex h-[calc(100svh-5.5rem)] flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
      <div className="flex items-center gap-3 border-b border-gray-100 px-3 py-4 sm:gap-4 sm:px-5">
        <Avatar name={other.name} imageUrl={other.imageUrl} />
        <p className="truncate text-base font-semibold capitalize text-gray-900 sm:text-lg">
          {other.name}
        </p>
      </div>
      {props.active ? <ActiveThread {...props} /> : <ExpiredThread {...props} />}
    </div>
  );
}

function ActiveThread({ chatId, viewer, other }: ChatThreadProps) {
  const list = useInfiniteQuery(chatMessagesInfiniteOptions(chatId));
  const sync = useSyncNewMessages(chatId);
  useChatRealtime(chatId, sync);

  // Oldest first, as they're shown. A message merged into the newest page
  // can come back in an older page fetched later; show it once.
  const messages = useMemo(() => {
    const seen = new Set<string>();
    return (list.data?.pages.flatMap((page) => page.items) ?? [])
      .filter((message) => !seen.has(message.id) && seen.add(message.id))
      .reverse();
  }, [list.data]);
  const newest = messages.at(-1);

  // Catch up once the first page is in: a message sent while it loaded (or
  // while this chat sat in the cache) would otherwise wait for the next
  // realtime event.
  const loaded = list.isSuccess;
  useEffect(() => {
    if (loaded) void sync();
  }, [loaded, sync]);

  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const nearBottom = useRef(true);
  const scrolledInitially = useRef(false);
  // Set while an older page loads, to keep the view where it was.
  const heightBeforeOlder = useRef<number | null>(null);

  const scrollToBottom = () => {
    const container = containerRef.current;
    if (container) container.scrollTop = container.scrollHeight;
  };

  // First load: start at the latest message.
  useLayoutEffect(() => {
    if (!list.data || scrolledInitially.current) return;
    scrolledInitially.current = true;
    scrollToBottom();
  }, [list.data]);

  // An older page landed above: keep the same messages on screen.
  const pageCount = list.data?.pages.length ?? 0;
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container || heightBeforeOlder.current === null) return;
    container.scrollTop += container.scrollHeight - heightBeforeOlder.current;
    heightBeforeOlder.current = null;
  }, [pageCount]);

  // A new message at the bottom: follow it if you were already there, or if
  // you sent it.
  useLayoutEffect(() => {
    if (!newest || !scrolledInitially.current) return;
    if (nearBottom.current || newest.senderId === viewer.id) scrollToBottom();
  }, [newest, viewer.id]);

  // Images and videos get their real height after they load; stay pinned to
  // the bottom meanwhile if that's where you are.
  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;
    const observer = new ResizeObserver(() => {
      if (nearBottom.current && heightBeforeOlder.current === null) {
        scrollToBottom();
      }
    });
    observer.observe(content);
    return () => observer.disconnect();
  }, [loaded]);

  const { hasNextPage, isFetchingNextPage, isFetchNextPageError, fetchNextPage } =
    list;
  // Loading an older page writes back the pages as they were when it
  // started, dropping anything merged in meanwhile; sync again afterwards.
  // A failed page doesn't move anything, so forget the saved height.
  const loadOlder = () => {
    heightBeforeOlder.current = containerRef.current?.scrollHeight ?? null;
    void fetchNextPage().then((result) => {
      if (result.isFetchNextPageError) heightBeforeOlder.current = null;
      void sync();
    });
  };
  const reachTop = useEffectEvent(() => {
    if (scrolledInitially.current) loadOlder();
  });
  // Reaching the top loads the next older page (not again after a failure;
  // that waits for the retry button).
  useEffect(() => {
    const container = containerRef.current;
    const top = topRef.current;
    if (!container || !top || !hasNextPage || isFetchingNextPage) return;
    if (isFetchNextPageError) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) reachTop();
      },
      { root: container, rootMargin: "200px 0px 0px 0px" },
    );
    observer.observe(top);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, isFetchNextPageError]);

  return (
    <>
      <div
        ref={containerRef}
        onScroll={(event) => {
          const el = event.currentTarget;
          nearBottom.current =
            el.scrollHeight - el.scrollTop - el.clientHeight < NEAR_BOTTOM_PX;
        }}
        className="flex-1 overflow-y-auto px-2 pt-4 sm:px-4"
      >
        {!list.data ? (
          list.isError ? (
            <QueryErrorState
              title="Couldn't load messages"
              error={list.error}
              onRetry={() => list.refetch()}
              isRetrying={list.isFetching}
            />
          ) : (
            <ThreadSkeleton />
          )
        ) : messages.length === 0 ? (
          <div className="flex h-full items-center justify-center px-4 py-12 text-center">
            <div>
              <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-emerald-50">
                <MessageCircle className="size-8 text-emerald-600" />
              </div>
              <p className="text-sm font-medium text-gray-600 sm:text-base">
                Start your conversation with{" "}
                <span className="font-semibold capitalize text-emerald-700">
                  {other.name}
                </span>
              </p>
              <p className="mt-2 text-xs text-gray-400 sm:text-sm">
                Send a message to begin chatting
              </p>
            </div>
          </div>
        ) : (
          <div ref={contentRef}>
            <div ref={topRef} className="flex min-h-4 justify-center pb-4">
              {isFetchingNextPage ? (
                <OlderMessagesSkeleton />
              ) : isFetchNextPageError ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={loadOlder}
                >
                  <RotateCw className="size-4" />
                  Couldn&apos;t load older messages. Retry
                </Button>
              ) : !hasNextPage && list.data.pages.length > 1 ? (
                <p className="text-xs font-medium text-gray-400">
                  Start of the conversation
                </p>
              ) : null}
            </div>
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                mine={message.senderId === viewer.id}
              />
            ))}
          </div>
        )}
      </div>
      <ChatComposer chatId={chatId} />
    </>
  );
}

function ExpiredThread({ role, viewer, mentorId, other }: ChatThreadProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 p-8">
      <div className="max-w-md rounded-lg border border-amber-200 bg-amber-50 p-6 text-center">
        {role === "student" ? (
          <p className="text-base font-medium leading-relaxed text-gray-800">
            Your chat subscription with{" "}
            <span className="font-bold capitalize text-emerald-700">
              {other.name}
            </span>{" "}
            has expired. Renew it to continue the conversation.
          </p>
        ) : (
          <p className="text-base font-medium leading-relaxed text-gray-800">
            This chat with{" "}
            <span className="font-bold capitalize text-emerald-700">
              {other.name}
            </span>{" "}
            has expired. It opens again when the student renews or books a
            service with you.
          </p>
        )}
      </div>
      {role === "student" && (
        <PaymentButton
          mentorId={mentorId}
          userId={viewer.id}
          userEmail={viewer.email}
          paymentType="chat_subscription"
        >
          Renew chat subscription
        </PaymentButton>
      )}
    </div>
  );
}

function Avatar({ name, imageUrl }: { name: string; imageUrl: string | null }) {
  return (
    <div className="relative size-10 shrink-0 overflow-hidden rounded-full bg-emerald-50 ring-2 ring-emerald-100 sm:size-12">
      {imageUrl ? (
        <Image src={imageUrl} alt="" fill sizes="48px" className="object-cover" />
      ) : (
        <span className="flex size-full items-center justify-center font-semibold text-emerald-700">
          {name.charAt(0).toUpperCase()}
        </span>
      )}
    </div>
  );
}

// Alternating bubbles, shaped like a conversation.
const SKELETON_BUBBLES = [
  { mine: false, width: "w-48" },
  { mine: true, width: "w-64" },
  { mine: false, width: "w-56" },
  { mine: false, width: "w-32" },
  { mine: true, width: "w-44" },
  { mine: true, width: "w-72" },
];

export function ThreadSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading messages" className="space-y-4 pb-4">
      {SKELETON_BUBBLES.map((bubble, i) => (
        <div key={i} className={bubble.mine ? "flex justify-end" : "flex"}>
          <Skeleton className={`h-10 max-w-[75%] rounded-2xl ${bubble.width}`} />
        </div>
      ))}
    </div>
  );
}

function OlderMessagesSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading older messages" className="w-full space-y-3">
      <Skeleton className="h-10 w-48 rounded-2xl" />
      <div className="flex justify-end">
        <Skeleton className="h-10 w-56 rounded-2xl" />
      </div>
    </div>
  );
}
