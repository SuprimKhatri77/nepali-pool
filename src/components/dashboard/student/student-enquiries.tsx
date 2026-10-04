"use client";

import { useState } from "react";
import Link from "next/link";
import { useInfiniteQuery } from "@tanstack/react-query";
import { HelpCircle, Loader2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EmptyState } from "@/components/data-states/empty-state";
import { LoadMore } from "@/components/data-states/load-more";
import { QueryErrorState } from "@/components/data-states/query-error-state";
import { RequestCardsSkeleton } from "@/components/dashboard/skeletons";
import { ENQUIRY_STATUS_META } from "@/components/mentor-services/format";
import { LocalDateTime } from "@/components/mentor-services/LocalDateTime";
import {
  studentEnquiriesInfiniteOptions,
  useWithdrawEnquiry,
} from "@/modules/student-dashboard/queries";
import type { StudentEnquiryRow } from "../../../../server/actions/student-dashboard/bookings";
import { SuccessBanner } from "./success-banner";

const STATUS_HINT: Record<StudentEnquiryRow["status"], string> = {
  new: "Waiting for the mentor to reply.",
  accepted:
    "The mentor accepted your enquiry and will contact you, or message them now.",
  declined: "The mentor can't take this on right now.",
  withdrawn: "You withdrew this enquiry.",
};

export function StudentEnquiries({
  justEnquired,
}: {
  justEnquired: string | null;
}) {
  const list = useInfiniteQuery({
    ...studentEnquiriesInfiniteOptions(),
    // Arriving from the enquiry form: a cached list predates the new enquiry.
    refetchOnMount: justEnquired ? "always" : true,
  });
  const enquiries = list.data?.pages.flatMap((page) => page.items) ?? [];
  const withdrawEnquiry = useWithdrawEnquiry();
  const [withdrawId, setWithdrawId] = useState<string | null>(null);
  const target = enquiries.find((e) => e.id === withdrawId) ?? null;

  const withdraw = () => {
    if (!target) return;
    withdrawEnquiry.mutate(target.id, {
      onSettled: () => setWithdrawId(null),
    });
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          Enquiries
        </h1>
        <p className="mt-1 text-gray-600">
          Free questions you&apos;ve asked mentors.
        </p>
      </div>

      {justEnquired && (
        <SuccessBanner>
          Enquiry sent! Your reference is{" "}
          <span className="font-mono font-semibold">{justEnquired}</span>.
          You&apos;ll get an email when the mentor replies.
        </SuccessBanner>
      )}

      {!list.data ? (
        list.isError ? (
          <QueryErrorState
            title="Couldn't load your enquiries"
            error={list.error}
            onRetry={() => list.refetch()}
            isRetrying={list.isFetching}
          />
        ) : (
          <RequestCardsSkeleton />
        )
      ) : enquiries.length === 0 ? (
        <EmptyState
          icon={HelpCircle}
          title="No enquiries yet"
          description="Ask any mentor a free question from their profile."
          action={
            <Button asChild variant="outline">
              <Link href="/mentors">Find a mentor</Link>
            </Button>
          }
        />
      ) : (
        <div className="space-y-4">
          {enquiries.map((enquiry) => (
            <EnquiryCard
              key={enquiry.id}
              enquiry={enquiry}
              onWithdraw={() => setWithdrawId(enquiry.id)}
            />
          ))}
          <LoadMore
            hasNextPage={list.hasNextPage}
            isFetchingNextPage={list.isFetchingNextPage}
            isFetchNextPageError={list.isFetchNextPageError}
            fetchNextPage={list.fetchNextPage}
            skeleton={<RequestCardsSkeleton count={2} />}
          />
        </div>
      )}

      <Dialog
        open={target !== null}
        onOpenChange={(open) =>
          !open && !withdrawEnquiry.isPending && setWithdrawId(null)
        }
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Withdraw this enquiry?</DialogTitle>
            <DialogDescription>
              {target?.referenceCode} to{" "}
              <span className="capitalize">{target?.mentorName}</span>. You can
              send a new one later.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              disabled={withdrawEnquiry.isPending}
              onClick={() => setWithdrawId(null)}
            >
              Keep it
            </Button>
            <Button
              variant="destructive"
              disabled={withdrawEnquiry.isPending}
              onClick={withdraw}
            >
              {withdrawEnquiry.isPending && (
                <Loader2 className="mr-2 size-4 animate-spin" />
              )}
              Withdraw
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function EnquiryCard({
  enquiry,
  onWithdraw,
}: {
  enquiry: StudentEnquiryRow;
  onWithdraw: () => void;
}) {
  const meta = ENQUIRY_STATUS_META[enquiry.status];
  const canMessage = enquiry.status === "accepted" && enquiry.chatId !== null;
  const canWithdraw = enquiry.status === "new";

  return (
    <Card className="gap-0 border-emerald-100 py-0">
      <CardContent className="space-y-3 p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs text-gray-500">
              {enquiry.referenceCode}
            </span>
            <Badge variant="outline" className={meta.className}>
              {meta.label}
            </Badge>
          </div>
          <span className="text-xs text-gray-500">
            <LocalDateTime value={enquiry.createdAt} />
          </span>
        </div>
        <div className="min-w-0">
          <p className="text-sm text-gray-600">
            To{" "}
            <Link
              href={`/mentors/${enquiry.mentorId}`}
              className="capitalize text-emerald-700 hover:underline"
            >
              {enquiry.mentorName}
            </Link>
          </p>
          <p className="mt-1 line-clamp-3 whitespace-pre-line break-words text-gray-900">
            {enquiry.question}
          </p>
        </div>
        <p className="text-sm text-gray-600">{STATUS_HINT[enquiry.status]}</p>
        {enquiry.mentorNote && (
          <p className="break-words rounded-md border border-gray-100 bg-gray-50 p-3 text-sm">
            <span className="font-medium">Mentor&apos;s note:</span>{" "}
            {enquiry.mentorNote}
          </p>
        )}
        {(canMessage || canWithdraw) && (
          <div className="flex gap-2 pt-1">
            {canMessage && (
              <Button
                asChild
                size="sm"
                className="bg-emerald-600 text-white hover:bg-emerald-700"
              >
                <Link href={`/chats/${enquiry.chatId}`}>
                  <MessageSquare className="mr-1 size-4" /> Message mentor
                </Link>
              </Button>
            )}
            {canWithdraw && (
              <Button
                size="sm"
                variant="outline"
                className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                onClick={onWithdraw}
              >
                Withdraw
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
