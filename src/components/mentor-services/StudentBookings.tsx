"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
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
import type { ServiceBookingSelectType } from "../../../lib/db/schema";
import { cancelServiceBooking } from "../../../server/actions/service-booking/update-booking-status";
import { BOOKING_STATUS_META, formatNpr } from "./format";
import { LocalDateTime } from "./LocalDateTime";

type StudentBooking = ServiceBookingSelectType & { mentorName: string };

const STATUS_HINT: Record<StudentBooking["status"], string> = {
  pending: "The mentor is checking your payment.",
  confirmed:
    "Payment verified. Your mentor will contact you, or message them now.",
  rejected: "The mentor couldn't verify your payment.",
  cancelled: "You cancelled this booking.",
  completed: "This session is complete.",
};

export default function StudentBookings({
  bookings,
  chatIdByMentor,
}: {
  bookings: StudentBooking[];
  chatIdByMentor: Record<string, string>;
}) {
  const router = useRouter();
  const [cancelId, setCancelId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const cancelTarget = bookings.find((b) => b.id === cancelId) ?? null;

  const cancel = () => {
    if (!cancelTarget) return;
    startTransition(async () => {
      const result = await cancelServiceBooking(cancelTarget.id);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
        // Status probably changed (e.g. mentor already verified it); show it.
        router.refresh();
      }
      setCancelId(null);
    });
  };

  return (
    <section id="bookings" className="scroll-mt-24">
      <h2 className="text-xl font-semibold text-gray-900 mb-3">
        Service bookings
      </h2>
      {bookings.length === 0 ? (
        <Card className="border-emerald-100">
          <CardContent className="py-14 text-center space-y-4">
            <CalendarCheck className="w-10 h-10 text-gray-300 mx-auto" />
            <p className="text-gray-600">
              You haven&apos;t booked any services yet.
            </p>
            <Button
              asChild
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <Link href="/mentors">Find a mentor</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const meta = BOOKING_STATUS_META[booking.status];
            const chatId = chatIdByMentor[booking.mentorId];
            const canMessage =
              (booking.status === "confirmed" ||
                booking.status === "completed") &&
              Boolean(chatId);
            const canCancel = booking.status === "pending";
            return (
              <Card key={booking.id} className="border-emerald-100">
                <CardContent className="p-5 space-y-3">
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
                  <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 break-words">
                        {booking.serviceTitle}
                      </p>
                      <p className="text-sm text-gray-600">
                        with{" "}
                        <Link
                          href={`/mentors/${booking.mentorId}`}
                          className="text-emerald-700 hover:underline capitalize"
                        >
                          {booking.mentorName}
                        </Link>
                      </p>
                    </div>
                    <span className="font-semibold text-gray-900">
                      {formatNpr(booking.priceNpr)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {STATUS_HINT[booking.status]}
                  </p>
                  {booking.status === "rejected" && booking.rejectionReason && (
                    <p className="text-sm rounded-md bg-red-50 border border-red-100 text-red-800 p-3 break-words">
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
                          className="bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                          <Link href={`/chats/${chatId}`}>
                            <MessageSquare className="w-4 h-4 mr-1" /> Message
                            mentor
                          </Link>
                        </Button>
                      )}
                      {canCancel && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                          onClick={() => setCancelId(booking.id)}
                        >
                          Cancel booking
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog
        open={cancelTarget !== null}
        onOpenChange={(open) => !open && !isPending && setCancelId(null)}
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
              disabled={isPending}
              onClick={() => setCancelId(null)}
            >
              Keep booking
            </Button>
            <Button variant="destructive" disabled={isPending} onClick={cancel}>
              {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Cancel booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
