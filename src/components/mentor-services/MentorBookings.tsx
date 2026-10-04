"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  mentorBookingCountsQueryOptions,
  mentorBookingsInfiniteOptions,
  mentorDashboardKeys,
} from "@/modules/mentor-dashboard/queries";
import { EmptyState } from "@/components/data-states/empty-state";
import { ListSkeleton } from "@/components/data-states/skeletons";
import { LoadMore } from "@/components/data-states/load-more";
import { QueryErrorState } from "@/components/data-states/query-error-state";
import {
  CheckCircle2,
  Inbox,
  Loader2,
  MessageCircle,
  MessageSquare,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ClickableImage } from "@/components/ClickableImage";
import type { ServiceBookingStatus } from "../../../lib/db/schema";
import type {
  BookingFilter,
  MentorBookingRow,
} from "../../../server/actions/mentor-dashboard/bookings";
import {
  completeServiceBooking,
  confirmServiceBooking,
  rejectServiceBooking,
  type BookingActionResult,
} from "../../../server/actions/service-booking/update-booking-status";
import { BOOKING_STATUS_META, formatNpr, whatsappLink } from "./format";
import { LocalDateTime } from "./LocalDateTime";

export type { BookingFilter };

const FILTERS: { value: BookingFilter; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "completed", label: "Completed" },
  { value: "rejected", label: "Rejected" },
  { value: "cancelled", label: "Cancelled" },
  { value: "all", label: "All" },
];

export default function MentorBookings({
  mentorName,
  filter,
}: {
  mentorName: string;
  filter: BookingFilter;
}) {
  const router = useRouter();
  const { data: counts } = useQuery(mentorBookingCountsQueryOptions());
  const list = useInfiniteQuery(mentorBookingsInfiniteOptions(filter));
  const bookings = list.data?.pages.flatMap((page) => page.items) ?? [];
  const [opened, setOpened] = useState<MentorBookingRow | null>(null);
  // Prefer the fresh row so the dialog reflects refetched data, but fall back
  // to the snapshot when the booking drops out of the current tab (e.g. right
  // after confirming from "Pending") so the dialog doesn't vanish mid-action.
  const selected = opened
    ? (bookings.find((b) => b.id === opened.id) ?? opened)
    : null;
  const total = counts
    ? Object.values(counts).reduce((sum, n) => sum + (n ?? 0), 0)
    : undefined;

  return (
    <div className="mx-auto max-w-5xl">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Service Bookings</h1>
        <p className="text-gray-600 mt-1 mb-6">
          Check each payment screenshot against your account before confirming.
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          {FILTERS.map((f) => {
            const n = f.value === "all" ? total : counts && (counts[f.value] ?? 0);
            const active = f.value === filter;
            return (
              <Link
                key={f.value}
                href={`/dashboard/mentor/bookings?status=${f.value}`}
                aria-current={active ? "page" : undefined}
                className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                  active
                    ? "bg-emerald-600 text-white border-emerald-600"
                    : "bg-white text-gray-700 border-gray-200 hover:border-emerald-300"
                }`}
              >
                {f.label}
                {n !== undefined && (
                  <span className={active ? "text-emerald-100" : "text-gray-400"}>
                    {" "}
                    {n}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {list.isPending ? (
          <ListSkeleton rows={5} />
        ) : list.isError ? (
          <QueryErrorState
            title="Couldn't load bookings"
            error={list.error}
            onRetry={() => list.refetch()}
            isRetrying={list.isFetching}
          />
        ) : bookings.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title={
              filter === "pending"
                ? "No bookings waiting for verification"
                : "No bookings here yet"
            }
          />
        ) : (
          <div className="space-y-3">
            {bookings.map((booking) => (
              <BookingRow
                key={booking.id}
                booking={booking}
                onReview={() => setOpened(booking)}
              />
            ))}
            <LoadMore
              hasNextPage={list.hasNextPage}
              isFetchingNextPage={list.isFetchingNextPage}
              isFetchNextPageError={list.isFetchNextPageError}
              fetchNextPage={list.fetchNextPage}
              skeleton={<ListSkeleton rows={2} />}
            />
          </div>
        )}
      </div>

      <Dialog
        open={selected !== null}
        onOpenChange={(open) => !open && setOpened(null)}
      >
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
          {selected && (
            <BookingDetails
              // Remount per booking so reject-reason state never carries over.
              key={selected.id}
              booking={selected}
              mentorName={mentorName}
              chatId={selected.chatId}
              onDone={() => setOpened(null)}
              // The lists were already refetched; just close the stale dialog.
              onStale={() => setOpened(null)}
              // Keep the dialog open on the confirmed booking so the mentor can
              // contact the student right away.
              onConfirmed={() => {
                setOpened({ ...selected, status: "confirmed", verifiedAt: new Date() });
                if (filter !== "all" && filter !== "confirmed") {
                  router.replace("/dashboard/mentor/bookings?status=confirmed");
                }
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StatusBadge({ status }: { status: ServiceBookingStatus }) {
  const meta = BOOKING_STATUS_META[status];
  return (
    <Badge variant="outline" className={meta.className}>
      {meta.label}
    </Badge>
  );
}

function BookingRow({
  booking,
  onReview,
}: {
  booking: MentorBookingRow;
  onReview: () => void;
}) {
  return (
    <Card className="border-emerald-100 hover:shadow-sm transition-shadow">
      <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="font-mono text-xs text-gray-500">{booking.referenceCode}</span>
            <StatusBadge status={booking.status} />
          </div>
          <p className="font-semibold text-gray-900 truncate capitalize">{booking.fullName}</p>
          <p className="text-sm text-gray-600 truncate">{booking.serviceTitle}</p>
        </div>
        <div className="flex sm:flex-col sm:items-end justify-between gap-1 text-sm">
          <span className="font-semibold text-gray-900">{formatNpr(booking.priceNpr)}</span>
          <span className="text-gray-500">
            <LocalDateTime value={booking.createdAt} />
          </span>
        </div>
        <Button
          variant={booking.status === "pending" ? "default" : "outline"}
          className={
            booking.status === "pending"
              ? "bg-emerald-600 hover:bg-emerald-700 text-white"
              : ""
          }
          onClick={onReview}
        >
          {booking.status === "pending" ? "Verify payment" : "View details"}
        </Button>
      </CardContent>
    </Card>
  );
}

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <div className="text-sm text-gray-900 break-words">{children}</div>
    </div>
  );
}

function BookingDetails({
  booking,
  mentorName,
  chatId,
  onDone,
  onConfirmed,
  onStale,
}: {
  booking: MentorBookingRow;
  mentorName: string;
  chatId: string | null;
  onDone: () => void;
  onConfirmed: () => void;
  onStale: () => void;
}) {
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState("");

  const run = (
    action: () => Promise<BookingActionResult>,
    onSuccess: () => void = onDone,
  ) =>
    startTransition(async () => {
      const result = await action();
      // Pending/new counts feed the sidebar badges and the overview.
      queryClient.invalidateQueries({ queryKey: mentorDashboardKeys.all });
      if (result.success) {
        toast.success(result.message);
        onSuccess();
      } else {
        toast.error(result.message);
        // The booking may have changed underneath us (e.g. student cancelled);
        // pull fresh data so the dialog shows its real status.
        onStale();
      }
    });

  const whatsappText = `Hi ${booking.fullName}, this is ${mentorName} from NepaliPool. I've confirmed your booking ${booking.referenceCode} for "${booking.serviceTitle}".`;

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex flex-wrap items-center gap-2">
          {booking.serviceTitle}
        </DialogTitle>
        <DialogDescription asChild>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono">{booking.referenceCode}</span>
            <StatusBadge status={booking.status} />
          </div>
        </DialogDescription>
      </DialogHeader>

      <div className="grid grid-cols-2 gap-4">
        <Detail label="Student">
          <span className="capitalize">{booking.fullName}</span>
        </Detail>
        <Detail label="Amount">
          <span className="font-semibold">{formatNpr(booking.priceNpr)}</span>
        </Detail>
        <Detail label="Email">{booking.email}</Detail>
        <Detail label="WhatsApp">{booking.whatsappNumber}</Detail>
        <Detail label="Transaction ID">{booking.paymentReference ?? "Not provided"}</Detail>
        <Detail label="Booked">
          <LocalDateTime value={booking.createdAt} />
        </Detail>
      </div>

      {booking.message && (
        <Detail label="Notes from student">
          <p className="mt-1 rounded-md bg-gray-50 border border-gray-100 p-3 whitespace-pre-line">
            {booking.message}
          </p>
        </Detail>
      )}

      <div>
        <p className="text-xs font-medium text-gray-500 mb-2">Payment screenshot</p>
        <ClickableImage
          src={booking.paymentProofUrl}
          alt={`Payment screenshot for ${booking.referenceCode}`}
          width={480}
          height={320}
          className="rounded-md border border-gray-200 object-contain max-h-72 w-auto bg-gray-50"
        />
      </div>

      {booking.status === "rejected" && booking.rejectionReason && (
        <Detail label="Rejection reason">{booking.rejectionReason}</Detail>
      )}

      {booking.status === "pending" &&
        (rejecting ? (
          <div className="space-y-2 rounded-md border border-red-100 bg-red-50/50 p-3">
            <Label htmlFor="reject-reason">Reason (sent to the student)</Label>
            <Textarea
              id="reject-reason"
              value={reason}
              maxLength={500}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. I couldn't find this payment in my account. Please check the amount and transaction ID."
            />
            <div className="flex gap-2 justify-end">
              <Button variant="outline" disabled={isPending} onClick={() => setRejecting(false)}>
                Back
              </Button>
              <Button
                variant="destructive"
                disabled={isPending || reason.trim().length < 5}
                onClick={() => run(() => rejectServiceBooking(booking.id, reason))}
              >
                {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Reject booking
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
              disabled={isPending}
              onClick={() => run(() => confirmServiceBooking(booking.id), onConfirmed)}
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4 mr-2" />
              )}
              Payment received, confirm
            </Button>
            <Button
              variant="outline"
              className="flex-1 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
              disabled={isPending}
              onClick={() => setRejecting(true)}
            >
              <XCircle className="w-4 h-4 mr-2" /> Reject
            </Button>
          </div>
        ))}

      {booking.status === "confirmed" && (
        <div className="flex flex-col sm:flex-row gap-2">
          <Button asChild className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white">
            <a
              href={whatsappLink(booking.whatsappNumber, whatsappText)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="w-4 h-4 mr-2" /> WhatsApp student
            </a>
          </Button>
          {chatId && (
            <Button asChild variant="outline" className="flex-1">
              <Link href={`/chats/${chatId}`}>
                <MessageSquare className="w-4 h-4 mr-2" /> Open chat
              </Link>
            </Button>
          )}
          <Button
            variant="outline"
            className="flex-1"
            disabled={isPending}
            onClick={() => run(() => completeServiceBooking(booking.id))}
          >
            {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Mark completed
          </Button>
        </div>
      )}
    </>
  );
}
