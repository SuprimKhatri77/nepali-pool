import { queryOptions } from "@tanstack/react-query";
import { unwrap } from "@/utils/action-result";
import type { videoCallStatusEnum } from "../../../lib/db/schema";
import {
  getMyVideoCallCounts,
  listMyVideoCalls,
} from "../../../server/actions/video-calls/list";

export type VideoCallStatus = (typeof videoCallStatusEnum.enumValues)[number];

export const videoCallKeys = {
  all: ["video-calls"] as const,
  list: (status: VideoCallStatus) =>
    [...videoCallKeys.all, "list", status] as const,
  counts: () => [...videoCallKeys.all, "counts"] as const,
};

export const myVideoCallsQueryOptions = (status: VideoCallStatus) =>
  queryOptions({
    queryKey: videoCallKeys.list(status),
    queryFn: async () => unwrap(await listMyVideoCalls({ status })),
    // Scheduling happens on other pages (and by the other person), so check
    // again on every visit, like the server-rendered page used to.
    staleTime: 0,
  });

export const myVideoCallCountsQueryOptions = () =>
  queryOptions({
    queryKey: videoCallKeys.counts(),
    queryFn: async () => unwrap(await getMyVideoCallCounts()),
    staleTime: 0,
  });
