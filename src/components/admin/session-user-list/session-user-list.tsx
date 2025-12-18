"use client";

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
import { Input } from "@/components/ui/input";
import { Mail, MapPin, MessageCircle, Users } from "lucide-react";
import { MeetingSessionSelectType } from "../../../../lib/db/schema";
import { useActionState, useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import {
  sendSessionLink,
  SendSessionLinkFormstate,
} from "../../../../server/actions/session/send-session-link";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { FieldError } from "@/components/ui/field";

type Props = {
  sessionUsers: MeetingSessionSelectType[];
};

const SessionUserList = ({ sessionUsers }: Props) => {
  const [showSetMeetingLink, setShowSetMeetingLink] = useState<boolean>(false);
  const [currentDate] = useState(() => Date.now())
  const intialState: SendSessionLinkFormstate = {
    message: "",
    success: false,
    timestamp: currentDate,
  };
  const [state, formAction, isPending] = useActionState<
    SendSessionLinkFormstate,
    FormData
  >(sendSessionLink, intialState);
  useEffect(() => {
    if (state.success && state.message) {
      setTimeout(() => {
        setShowSetMeetingLink(false)
      }, 0);
      toast.success(state.message, { position: "top-right" });
    }
    if (!state.success && state.message) {
      toast.error(state.message, { position: "top-right" });
    }
  }, [state.success, state.message, state.timestamp]);
  return (
    <div className="w-full max-w-5xl mx-auto p-6">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center pb-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">
                Session Participants
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                {sessionUsers.length}{" "}
                {sessionUsers.length === 1 ? "attendee" : "attendees"}{" "}
                registered
              </p>
            </div>
          </div>
          <Button
            onClick={() => setShowSetMeetingLink(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all hover:shadow-md"
          >
            Send meeting link
          </Button>
        </div>

        {sessionUsers.length > 0 ? (
          <div className="grid gap-4">
            {sessionUsers.map((user) => (
              <div
                key={user.id}
                className="group relative bg-white border border-gray-200 rounded-xl p-5 hover:border-emerald-300 hover:shadow-lg transition-all duration-200"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-emerald-400 to-emerald-600 rounded-l-xl opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="flex flex-col gap-3 pl-2">
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center text-emerald-700 font-semibold text-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {user.name}
                    </h3>
                  </div>

                  <div className="flex flex-col gap-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="h-4 w-4 text-emerald-600" />
                      <span>{user.email}</span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="h-4 w-4 text-emerald-600" />
                      <span>{user.city}</span>
                    </div>
                  </div>

                  {user.question && (
                    <div className="mt-2 pt-3 border-t border-gray-100">
                      <div className="flex items-start gap-2">
                        <MessageCircle className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-xs font-medium text-gray-500 mb-1">
                            Question
                          </p>
                          <p className="text-sm text-gray-700 leading-relaxed">
                            {user.question}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Users className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              No participants yet
            </h3>
            <p className="text-sm text-gray-500 text-center max-w-sm">
              When people sign up for this session, they&apos;ll appear here
            </p>
          </div>
        )}
      </div>

      {showSetMeetingLink && (
        <Dialog open={showSetMeetingLink} onOpenChange={setShowSetMeetingLink}>
          <DialogContent className="sm:max-w-[425px]">
            <form action={formAction} className="flex w-full flex-col gap-4">
              <DialogHeader>
                <DialogTitle>Send Meeting Link to Attendees</DialogTitle>
                <DialogDescription>
                  Send the meeting link to the attendees so that they can join
                  the meeting.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4">
                <div className="grid gap-3">
                  <Label htmlFor="meetingLink">Meeting Link</Label>
                  <Input id="meetingLink" name="meetingLink" />
                  {state.errors?.meetingLink && (
                    <FieldError>{state.errors.meetingLink[0]}</FieldError>
                  )}
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" disabled={isPending}>
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit" disabled={isPending}>
                  {isPending ? <Spinner /> : "Send Meeting Link"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default SessionUserList;
