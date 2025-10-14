"use client";

import { Mail, User } from "lucide-react";
import Image from "next/image";
import {
  FormState,
  scheduleVideoCall,
} from "../../server/actions/admin/scheduleVideoCall";
import { Button } from "./ui/button";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { VideoCallWithStudentAndMentor } from "../../types/all-types";

export default function ScheduleVideoCallWithMentor({
  videoCallRecord,
}: {
  videoCallRecord: VideoCallWithStudentAndMentor;
}) {
  const initialState: FormState = {
    errors: {},
    message: "",
    success: false,
  } as FormState;
  const [state, formAction, isPending] = useActionState(
    scheduleVideoCall,
    initialState
  );

  useEffect(() => {
    if (state.success && state.message) {
      toast.success(state.message);
    }
    if (!state.success && state.message) {
      toast.error(state.message);
    }
  }, [state.success, state.message]);
  return (
    <div className="flex flex-col max-w-xl bg-slate-50 mx-auto h-full w-full my-5 py-5 px-7 rounded-lg gap-3">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            {" "}
            <span className="flex gap-1 items-center">
              <User /> :
            </span>
            {videoCallRecord.studentProfile.user.name}
          </div>
          <div className="flex item-center gap-2">
            <span className="flex gap-1 items-center">
              <Mail />:
            </span>
            {videoCallRecord.studentProfile.user.email}
          </div>
        </div>
        <Image
          src={videoCallRecord.studentProfile.imageUrl || ""}
          alt=""
          width={150}
          height={150}
          className="rounded-full"
        />
      </div>
      <form action={formAction}>
        <input
          type="hidden"
          name="studentId"
          value={videoCallRecord.studentId}
          required
        />
        <input
          required
          type="hidden"
          name="mentorId"
          value={videoCallRecord.mentorId}
        />
        <input
          type="hidden"
          name="status"
          value={
            videoCallRecord.status as "pending" | "cancelled" | "scheduled"
          }
          required
        />
        <input
          type="hidden"
          name="videoCallId"
          value={videoCallRecord.id}
          required
        />
        <Button type="submit" disabled={isPending}>
          {isPending ? "Scheduling....." : " Send Video Call Schedule"}
        </Button>
      </form>
    </div>
  );
}
