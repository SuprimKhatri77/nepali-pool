"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useInfiniteQuery } from "@tanstack/react-query";
import { CalendarCheck, Loader2, MessageSquare } from "lucide-react";
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
import {
  BOOKING_STATUS_META,
  formatNpr,
} from "@/components/mentor-services/format";
import { LocalDateTime } from "@/components/mentor-services/LocalDateTime";
import {
  studentBookingsInfiniteOptions,
  useCancelBooking,
} from "@/modules/student-dashboard/queries";
import type { StudentBookingRow } from "../../../../server/actions/student-dashboard/bookings";
import { STUDENT_ENQUIRIES_HREF } from "./routes";
import { SuccessBanner } from "./success-banner";

const STATUS_HINT: Record<StudentBookingRow["status"], string> = {
  pending: "The mentor is checking your payment.",
  confirmed:
    "Payment verified. Your mentor will contact you, or message them now.",
  rejected: "The mentor couldn't verify your payment.",
  cancelled: "You cancelled this booking.",
  completed: "This session is complete.",
};

export function StudentBookings({ justBooked }: { justBooked: string | null }) {
  const router = useRouter();
  const list = useInfiniteQuery({
    ...studentBookingsInfiniteOptions(),
    // Arriving from the booking form: a cached list predates the new booking.
    refetchOnMount: justBooked ? "always" : true,
  });
  const bookings = list.data?.pages.flatMap((page) => page.items) ?? [];
  const cancelBooking = useCancelBooking();
  const [cancelId, setCancelId] = useState<string | null>(null);
  const cancelTarget = bookings.find((b) => b.id === cancelId) ?? null;

  // Emails sent before enquiries got their own page link to
  // /bookings#enquiries, which redirects here with the hash intact.
  useEffect(() => {
    if (window.location.hash === "#enquiries") {
      router.replace(STUDENT_ENQUIRIES_HREF);
    }
  }, [router]);

  const cancel = () => {
    if (!cancelTarget) return;
    cancelBooking.mutate(cancelTarget.id, {
      onSettled: () => setCancelId(null),
    });
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          My bookings
        </h1>
        <p className="mt-1 text-gray-600">
          Services you&apos;ve booked with mentors.
        </p>
      </div>

      {justBooked && (
        <SuccessBanner>
          Booking submitted! Your reference is{" "}
          <span className="font-mono font-semibold">{justBooked}</span>. The
          mentor will verify your payment and you&apos;ll get an email once
          it&apos;s confirmed.
        </SuccessBanner>
      )}

      {!list.data ? (
        // Only before the first page arrives: once there's data, a failed
        // refetch or next page keeps the list (LoadMore shows its own retry).
        list.isError ? (
          <QueryErrorState
            title="Couldn't load your bookings"
            error={list.error}
            onRetry={() => list.refetch()}
            isRetrying={list.isFetching}
          />
        ) : (
          <RequestCardsSkeleton />
        )
      ) : bookings.length === 0 ? (
        <EmptyState
          icon={CalendarCheck}
          title="No bookings yet"
          description="Book a service from a mentor's profile and it will show up here."
          action={
            <Button
              asChild
              className="bg-emerald-600 text-white hover:bg-emerald-700"
            >
              <Link href="/mentors?services=1">Browse mentor services</Link>
            </Button>
          }
        />
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onCancel={() => setCancelId(booking.id)}
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
        open={cancelTarget !== null}
        onOpenChange={(open) =>
          !open && !cancelBooking.isPending && setCancelId(null)
        }
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cancel this booking?</DialogTitle>
            <DialogDescription>
              {cancelTarget?.serviceTitle} ({cancelTarget?.referenceCode}).
              NepaliPool doesn&apos;t handle payments, so contact the mentor
              directly about a refund if you&apos;ve already paid.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              disabled={cancelBooking.isPending}
              onClick={() => setCancelId(null)}
            >
              Keep booking
            </Button>
            <Button
              variant="destructive"
              disabled={cancelBooking.isPending}
              onClick={cancel}
            >
              {cancelBooking.isPending && (
                <Loader2 className="mr-2 size-4 animate-spin" />
              )}
              Cancel booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function BookingCard({
  booking,
  onCancel,
}: {
  booking: StudentBookingRow;
  onCancel: () => void;
}) {
  const meta = BOOKING_STATUS_META[booking.status];
  const canMessage =
    (booking.status === "confirmed" || booking.status === "completed") &&
    booking.chatId !== null;
  const canCancel = booking.status === "pending";

  return (
    <Card className="gap-0 border-emerald-100 py-0">
      <CardContent className="space-y-3 p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs text-gray-500">
              {booking.referenceCode}
            </span>
            <Badge variant="outline" className={meta.className}>
              {meta.label}
            </Badge>
          </div>
          <span className="text-xs text-gray-500">
            <LocalDateTime value={booking.createdAt} />
          </span>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <p className="break-words font-semibold text-gray-900">
              {booking.serviceTitle}
            </p>
            <p className="text-sm text-gray-600">
              with{" "}
              <Link
                href={`/mentors/${booking.mentorId}`}
                className="capitalize text-emerald-700 hover:underline"
              >
                {booking.mentorName}
              </Link>
            </p>
          </div>
          <span className="font-semibold text-gray-900">
            {formatNpr(booking.priceNpr)}
          </span>
        </div>
        <p className="text-sm text-gray-600">{STATUS_HINT[booking.status]}</p>
        {booking.status === "rejected" && booking.rejectionReason && (
          <p className="break-words rounded-md border border-red-100 bg-red-50 p-3 text-sm text-red-800">
            <span className="font-medium">Reason:</span>{" "}
            {booking.rejectionReason}
          </p>
        )}
        {(canMessage || canCancel) && (
          <div className="flex gap-2 pt-1">
            {canMessage && (
              <Button
                asChild
                size="sm"
                className="bg-emerald-600 text-white hover:bg-emerald-700"
              >
                <Link href={`/chats/${booking.chatId}`}>
                  <MessageSquare className="mr-1 size-4" /> Message mentor
                </Link>
              </Button>
            )}
            {canCancel && (
              <Button
                size="sm"
                variant="outline"
                className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                onClick={onCancel}
              >
                Cancel booking
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
