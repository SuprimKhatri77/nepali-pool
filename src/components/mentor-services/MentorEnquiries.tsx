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
  mentorDashboardKeys,
  mentorEnquiriesInfiniteOptions,
  mentorEnquiryCountsQueryOptions,
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
import type { MentorEnquiryStatus } from "../../../lib/db/schema";
import type {
  EnquiryFilter,
  MentorEnquiryRow,
} from "../../../server/actions/mentor-dashboard/enquiries";
import { respondToEnquiry } from "../../../server/actions/mentor-enquiry/update-enquiry-status";
import {
  BUDGET_READINESS_LABELS,
  ENGLISH_LEVEL_LABELS,
  ENQUIRY_STATUS_META,
  whatsappLink,
} from "./format";
import { LocalDateTime } from "./LocalDateTime";

export type { EnquiryFilter, MentorEnquiryRow };

const FILTERS: { value: EnquiryFilter; label: string }[] = [
  { value: "new", label: "New" },
  { value: "accepted", label: "Accepted" },
  { value: "declined", label: "Declined" },
  { value: "withdrawn", label: "Withdrawn" },
  { value: "all", label: "All" },
];

export default function MentorEnquiries({
  mentorName,
  filter,
}: {
  mentorName: string;
  filter: EnquiryFilter;
}) {
  const router = useRouter();
  const { data: counts } = useQuery(mentorEnquiryCountsQueryOptions());
  const list = useInfiniteQuery(mentorEnquiriesInfiniteOptions(filter));
  const enquiries = list.data?.pages.flatMap((page) => page.items) ?? [];
  const [opened, setOpened] = useState<MentorEnquiryRow | null>(null);
  // Prefer the fresh row; fall back to the snapshot when the enquiry leaves
  // the current tab (e.g. right after accepting from "New") so the dialog
  // stays put.
  const selected = opened
    ? (enquiries.find((e) => e.id === opened.id) ?? opened)
    : null;
  const total = counts
    ? Object.values(counts).reduce((sum, n) => sum + (n ?? 0), 0)
    : undefined;

  return (
    <div className="mx-auto max-w-5xl">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Enquiries</h1>
        <p className="text-gray-600 mt-1 mb-6">
          Free questions from students, with their background to help you
          screen.
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          {FILTERS.map((f) => {
            const n = f.value === "all" ? total : counts && (counts[f.value] ?? 0);
            const active = f.value === filter;
            return (
              <Link
                key={f.value}
                href={`/dashboard/mentor/enquiries?status=${f.value}`}
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
            title="Couldn't load enquiries"
            error={list.error}
            onRetry={() => list.refetch()}
            isRetrying={list.isFetching}
          />
        ) : enquiries.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title={filter === "new" ? "No new enquiries" : "No enquiries here yet"}
          />
        ) : (
          <div className="space-y-3">
            {enquiries.map((enquiry) => (
              <Card
                key={enquiry.id}
                className="border-emerald-100 hover:shadow-sm transition-shadow"
              >
                <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-mono text-xs text-gray-500">
                        {enquiry.referenceCode}
                      </span>
                      <StatusBadge status={enquiry.status} />
                    </div>
                    <p className="font-semibold text-gray-900 truncate capitalize">
                      {enquiry.fullName}
                    </p>
                    <p className="text-sm text-gray-600 line-clamp-1 break-words">
                      {enquiry.question}
                    </p>
                  </div>
                  <div className="text-sm text-gray-500 sm:text-right">
                    <p>{enquiry.targetCourse}</p>
                    <LocalDateTime value={enquiry.createdAt} />
                  </div>
                  <Button
                    variant={enquiry.status === "new" ? "default" : "outline"}
                    className={
                      enquiry.status === "new"
                        ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                        : ""
                    }
                    onClick={() => setOpened(enquiry)}
                  >
                    {enquiry.status === "new" ? "Review" : "View"}
                  </Button>
                </CardContent>
              </Card>
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
            <EnquiryDetails
              key={selected.id}
              enquiry={selected}
              mentorName={mentorName}
              chatId={selected.chatId}
              onDeclined={() => setOpened(null)}
              onAccepted={(contact) => {
                setOpened({
                  ...selected,
                  ...contact,
                  status: "accepted",
                  respondedAt: new Date(),
                });
                if (filter !== "all" && filter !== "accepted") {
                  router.replace("/dashboard/mentor/enquiries?status=accepted");
                }
              }}
              // The lists were already refetched; just close the stale dialog.
              onStale={() => setOpened(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StatusBadge({ status }: { status: MentorEnquiryStatus }) {
  const meta = ENQUIRY_STATUS_META[status];
  return (
    <Badge variant="outline" className={meta.className}>
      {meta.label}
    </Badge>
  );
}

function Detail({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <div className="text-sm text-gray-900 break-words">{children}</div>
    </div>
  );
}

function EnquiryDetails({
  enquiry,
  mentorName,
  chatId,
  onAccepted,
  onDeclined,
  onStale,
}: {
  enquiry: MentorEnquiryRow;
  mentorName: string;
  chatId: string | null;
  onAccepted: (contact: { email: string; whatsappNumber: string }) => void;
  onDeclined: () => void;
  onStale: () => void;
}) {
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();
  const [note, setNote] = useState("");

  const respond = (decision: "accepted" | "declined") =>
    startTransition(async () => {
      const result = await respondToEnquiry(enquiry.id, decision, note);
      // Pending/new counts feed the sidebar badges and the overview.
      queryClient.invalidateQueries({ queryKey: mentorDashboardKeys.all });
      if (result.success) {
        toast.success(result.message);
        if (decision === "accepted" && result.contact)
          onAccepted(result.contact);
        else onDeclined();
      } else {
        toast.error(result.message);
        onStale();
      }
    });

  const whatsappText = `Hi ${enquiry.fullName}, this is ${mentorName} from NepaliPool. Thanks for your question (${enquiry.referenceCode}). Happy to help!`;

  return (
    <>
      <DialogHeader>
        <DialogTitle className="capitalize">{enquiry.fullName}</DialogTitle>
        <DialogDescription asChild>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono">{enquiry.referenceCode}</span>
            <StatusBadge status={enquiry.status} />
            <span className="text-xs">
              <LocalDateTime value={enquiry.createdAt} />
            </span>
          </div>
        </DialogDescription>
      </DialogHeader>

      <Detail label="Question">
        <p className="mt-1 rounded-md bg-gray-50 border border-gray-100 p-3 whitespace-pre-line">
          {enquiry.question}
        </p>
      </Detail>

      <div className="grid grid-cols-2 gap-4">
        <Detail label="Qualification">{enquiry.qualification}</Detail>
        <Detail label="Wants to study">{enquiry.targetCourse}</Detail>
        <Detail label="English">
          {ENGLISH_LEVEL_LABELS[enquiry.englishLevel]}
          {enquiry.englishTestScore && ` · ${enquiry.englishTestScore}`}
        </Detail>
        <Detail label="Intake">
          {enquiry.intakeMonth} {enquiry.intakeYear}
        </Detail>
        <Detail label="Finances">
          {BUDGET_READINESS_LABELS[enquiry.budgetReadiness]}
        </Detail>
        {/* Contact details unlock once the mentor accepts. */}
        {enquiry.status === "accepted" && (
          <>
            <Detail label="Email">{enquiry.email}</Detail>
            <Detail label="WhatsApp">{enquiry.whatsappNumber}</Detail>
          </>
        )}
      </div>

      <Detail label="Goals & why abroad">
        <p className="mt-1 whitespace-pre-line">{enquiry.goals}</p>
      </Detail>

      {enquiry.mentorNote && (
        <Detail label="Your note">{enquiry.mentorNote}</Detail>
      )}

      {enquiry.status === "new" && (
        <div className="space-y-3 border-t border-gray-100 pt-4">
          <div className="space-y-1.5">
            <Label htmlFor="enquiry-note">Note to the student (optional)</Label>
            <Textarea
              id="enquiry-note"
              value={note}
              maxLength={500}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Happy to help! Message me on WhatsApp and we can set up a time."
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
              disabled={isPending}
              onClick={() => respond("accepted")}
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4 mr-2" />
              )}
              Accept
            </Button>
            <Button
              variant="outline"
              className="flex-1 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
              disabled={isPending}
              onClick={() => respond("declined")}
            >
              <XCircle className="w-4 h-4 mr-2" /> Decline
            </Button>
          </div>
        </div>
      )}

      {enquiry.status === "accepted" && enquiry.whatsappNumber && (
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            asChild
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <a
              href={whatsappLink(enquiry.whatsappNumber, whatsappText)}
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
        </div>
      )}
    </>
  );
}
