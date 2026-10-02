"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
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
import type { MentorEnquirySelectType } from "../../../lib/db/schema";
import { withdrawEnquiry } from "../../../server/actions/mentor-enquiry/update-enquiry-status";
import { ENQUIRY_STATUS_META } from "./format";
import { LocalDateTime } from "./LocalDateTime";

type StudentEnquiry = MentorEnquirySelectType & { mentorName: string };

const STATUS_HINT: Record<StudentEnquiry["status"], string> = {
  new: "Waiting for the mentor to reply.",
  accepted:
    "The mentor accepted your enquiry and will contact you, or message them now.",
  declined: "The mentor can't take this on right now.",
  withdrawn: "You withdrew this enquiry.",
};

export default function StudentEnquiries({
  enquiries,
  chatIdByMentor,
}: {
  enquiries: StudentEnquiry[];
  chatIdByMentor: Record<string, string>;
}) {
  const router = useRouter();
  const [withdrawId, setWithdrawId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const target = enquiries.find((e) => e.id === withdrawId) ?? null;

  const withdraw = () => {
    if (!target) return;
    startTransition(async () => {
      const result = await withdrawEnquiry(target.id);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
        // The mentor probably answered meanwhile; show the latest status.
        router.refresh();
      }
      setWithdrawId(null);
    });
  };

  return (
    <section id="enquiries" className="scroll-mt-24">
      <h2 className="text-xl font-semibold text-gray-900 mb-3">Enquiries</h2>
      {enquiries.length === 0 ? (
        <Card className="border-emerald-100">
          <CardContent className="py-10 text-center space-y-3">
            <HelpCircle className="w-9 h-9 text-gray-300 mx-auto" />
            <p className="text-gray-600">
              No enquiries yet. Ask any mentor a free question from their
              profile.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {enquiries.map((enquiry) => {
            const meta = ENQUIRY_STATUS_META[enquiry.status];
            const chatId = chatIdByMentor[enquiry.mentorId];
            const canMessage = enquiry.status === "accepted" && Boolean(chatId);
            const canWithdraw = enquiry.status === "new";
            return (
              <Card key={enquiry.id} className="border-emerald-100">
                <CardContent className="p-5 space-y-3">
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
                        className="text-emerald-700 hover:underline capitalize"
                      >
                        {enquiry.mentorName}
                      </Link>
                    </p>
                    <p className="mt-1 text-gray-900 whitespace-pre-line break-words line-clamp-3">
                      {enquiry.question}
                    </p>
                  </div>
                  <p className="text-sm text-gray-600">
                    {STATUS_HINT[enquiry.status]}
                  </p>
                  {enquiry.mentorNote && (
                    <p className="text-sm rounded-md bg-gray-50 border border-gray-100 p-3 break-words">
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
                          className="bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                          <Link href={`/chats/${chatId}`}>
                            <MessageSquare className="w-4 h-4 mr-1" /> Message
                            mentor
                          </Link>
                        </Button>
                      )}
                      {canWithdraw && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                          onClick={() => setWithdrawId(enquiry.id)}
                        >
                          Withdraw
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
        open={target !== null}
        onOpenChange={(open) => !open && !isPending && setWithdrawId(null)}
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
              disabled={isPending}
              onClick={() => setWithdrawId(null)}
            >
              Keep it
            </Button>
            <Button
              variant="destructive"
              disabled={isPending}
              onClick={withdraw}
            >
              {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Withdraw
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
