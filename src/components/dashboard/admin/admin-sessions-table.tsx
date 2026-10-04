"use client";

import { useActionState, useEffect, useEffectEvent, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Loader2, Send, Users } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/components/lib/utils";
import { EmptyState } from "@/components/data-states/empty-state";
import { QueryErrorState } from "@/components/data-states/query-error-state";
import { AdminTableSkeleton } from "@/components/dashboard/skeletons";
import { adminSessionsQueryOptions } from "@/modules/admin-dashboard/queries";
import {
  sendSessionLink,
  type SendSessionLinkFormstate,
} from "../../../../server/actions/session/send-session-link";
import type { AdminSessionRow } from "../../../../server/actions/admin-dashboard/calls";
import { TablePagination } from "./table-pagination";
import { TableSearch } from "./table-search";
import { useTableParams } from "@/components/dashboard/use-table-params";

export function AdminSessionsTable() {
  const { setParams, q, page } = useTableParams();
  const list = useQuery(adminSessionsQueryOptions({ q, page }));
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  // Bumped on every opening: remounts the dialog so each one starts with an
  // empty form and no previous result.
  const [linkDialogKey, setLinkDialogKey] = useState(0);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Meeting sessions
          </h1>
          <p className="mt-1 text-gray-600">
            People registered for the group session.
          </p>
        </div>
        <Button
          onClick={() => {
            setLinkDialogKey((key) => key + 1);
            setLinkDialogOpen(true);
          }}
          className="bg-emerald-600 text-white hover:bg-emerald-700"
        >
          <Send className="size-4" />
          Send meeting link
        </Button>
      </div>

      <TableSearch
        value={q}
        onSearch={(text) => setParams({ q: text, page: null }, { replace: true })}
        placeholder="Search name, email, city"
      />

      {!list.data || (list.isPlaceholderData && list.data.total === 0) ? (
        list.isError && !list.isPlaceholderData ? (
          <QueryErrorState
            title="Couldn't load registrations"
            error={list.error}
            onRetry={() => list.refetch()}
            isRetrying={list.isFetching}
          />
        ) : (
          <AdminTableSkeleton />
        )
      ) : list.data.total === 0 ? (
        <EmptyState
          icon={Users}
          title={q ? `No one matches "${q}"` : "No registrations yet"}
          description={
            q
              ? "Try a different name, email or city."
              : "People who sign up for the session will appear here."
          }
        />
      ) : (
        <div className="space-y-4">
          <div
            className={cn(
              "overflow-x-auto rounded-xl border border-slate-200 bg-white transition-opacity",
              list.isPlaceholderData && "opacity-60",
            )}
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Attendee</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Question</TableHead>
                  <TableHead>Registered</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {list.data.items.map((attendee) => (
                  <SessionRow key={attendee.id} attendee={attendee} />
                ))}
              </TableBody>
            </Table>
          </div>
          <TablePagination
            page={list.data.page}
            requestedPage={page}
            pageCount={list.data.pageCount}
            total={list.data.total}
            pageSize={list.data.pageSize}
            onPage={(next) => setParams({ page: next === 1 ? null : next })}
          />
        </div>
      )}

      <SendLinkDialog
        key={linkDialogKey}
        open={linkDialogOpen}
        onOpenChange={setLinkDialogOpen}
      />
    </div>
  );
}

function SessionRow({ attendee }: { attendee: AdminSessionRow }) {
  return (
    <TableRow>
      <TableCell>
        <div className="min-w-48">
          <p className="truncate font-medium capitalize text-gray-900">
            {attendee.name}
          </p>
          <p className="truncate text-sm text-gray-500">{attendee.email}</p>
        </div>
      </TableCell>
      <TableCell className="capitalize text-gray-700">{attendee.city}</TableCell>
      <TableCell className="max-w-md text-gray-700">
        {attendee.question ? (
          <p className="line-clamp-2 whitespace-normal break-words">
            {attendee.question}
          </p>
        ) : (
          "—"
        )}
      </TableCell>
      <TableCell className="whitespace-nowrap text-gray-700">
        {attendee.registeredAt
          ? format(attendee.registeredAt, "d MMM yyyy")
          : "—"}
      </TableCell>
    </TableRow>
  );
}

// Owns the send's state, and stays mounted while closed, so a result that
// arrives after the dialog closes is still reported. Closing is blocked
// while sending: closing and resending would email everyone twice.
function SendLinkDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [state, formAction, isPending] = useActionState<
    SendSessionLinkFormstate,
    FormData
  >(sendSessionLink, { message: "", success: false, timestamp: 0 });

  const report = useEffectEvent((result: SendSessionLinkFormstate) => {
    if (!result.message) return;
    if (result.success) {
      toast.success(result.message);
      onOpenChange(false);
    } else if (!result.errors) {
      // Field errors are shown under the input instead.
      toast.error(result.message);
    }
  });
  // A new state object per submit, so each result is reported exactly once.
  useEffect(() => report(state), [state]);

  const blockWhilePending = (event: Event) => {
    if (isPending) event.preventDefault();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next && isPending) return;
        onOpenChange(next);
      }}
    >
      <DialogContent
        className="sm:max-w-md"
        showCloseButton={!isPending}
        onEscapeKeyDown={blockWhilePending}
        onInteractOutside={blockWhilePending}
      >
        <form action={formAction} className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>Send the meeting link</DialogTitle>
            <DialogDescription>
              Emails the link to everyone registered for the session.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2">
            <Label htmlFor="meetingLink">Meeting link</Label>
            <Input
              id="meetingLink"
              name="meetingLink"
              type="url"
              placeholder="https://"
              defaultValue={state.inputs?.meetingLink}
              aria-invalid={Boolean(state.errors?.meetingLink)}
            />
            {state.errors?.meetingLink && (
              <FieldError>{state.errors.meetingLink[0]}</FieldError>
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button" disabled={isPending}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-emerald-600 text-white hover:bg-emerald-700"
            >
              {isPending && <Loader2 className="size-4 animate-spin" />}
              {isPending ? "Sending..." : "Send link"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
