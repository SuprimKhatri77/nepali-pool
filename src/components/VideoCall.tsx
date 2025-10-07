"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getVideoCallPreferredTime } from "../../server/helper/getVideoCallPreferredTime";
import { useState } from "react";
import { VideoCallWithStudentAndMentor } from "../../types/all-types";

export default function VideoCall({
  videoCallRecords,
  role,
}: {
  videoCallRecords: VideoCallWithStudentAndMentor[];
  role: string;
}) {
  const params = useSearchParams();
  const status = params.get("status");
  const [containsStudentPreferredTime, setContainsStudentPreferredTime] =
    useState<boolean>(false);
  const hasStudentPreferredTime = async (videoId: string) => {
    const data = videoCallRecords.find((vid) => vid.id === videoId);
    if (!data) {
      return true;
    }

    const preferredTime = await getVideoCallPreferredTime(data.id);
    if (preferredTime) {
      setContainsStudentPreferredTime(true);
      return;
    } else {
      setContainsStudentPreferredTime(false);
      return;
    }
  };
  return (
    <div>
      {(status === "pending" || !status) && (
        <div className="flex flex-col gap-5 px-15 py-5">
          <h1>Pending video call status</h1>
          <div className="flex gap-5">
            <Link
              href="/video-call?status=completed"
              className="bg-green-400 hover:bg-green-500 transition-all duration-300 py-2 px-5 rounded-lg text-slate-600 font-medium"
            >
              Completed
            </Link>
            <Link
              href="/video-call?status=scheduled"
              className="bg-blue-400 hover:bg-blue-500 transition-all duration-300 py-2 px-5 rounded-lg text-slate-600 font-medium"
            >
              Scheduled
            </Link>
            <Link
              href="/video-call?status=cancelled"
              className="bg-red-400 hover:bg-red-500 transition-all duration-300 py-2 px-5 rounded-lg text-slate-600 font-medium"
            >
              Cancelled
            </Link>
          </div>

          <div className="flex max-w-5xl mx-auto bg-slate-200 w-full py-7 px-8 rounded-lg gap-7">
            {role === "student" ? (
              videoCallRecords
                .filter((vcr) => vcr.status === "pending")
                .map((videoCall) => (
                  <div
                    key={videoCall.id}
                    className="flex flex-col bg-orange-200 px-4 py-3 rounded-sm gap-3"
                  >
                    <div>
                      <div className="flex">
                        <Image
                          src={videoCall.mentorProfile.imageUrl || ""}
                          width={120}
                          height={120}
                          alt=""
                          className="rounded-full"
                        />
                        <p className="bg-indigo-600 text-white rounded-full h-fit py-2 px-3 font-medium">
                          {videoCall.status}
                        </p>
                      </div>
                      <h1>Mentor: {videoCall.mentorProfile.user.name}</h1>
                    </div>
                    <div>
                      <p className="">
                        Purchased for:
                        <span className="underline">
                          {videoCall.mentorProfile.user.name}
                        </span>
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div>
                        <p className="text-muted-foreground text-sm">
                          Please select a preferred date for your video call
                        </p>
                        <p className="text-muted-foreground text-xs">
                          A mentor will review your preferred time and schedule
                          the video call or will send a new Date and Time which
                          the mentor is avialabe at.
                        </p>
                      </div>

                      {videoCall.preferredTime ? (
                        videoCall.preferredTime.studentPreferredTime && (
                          <Link
                            href={`/video-call/schedule/${videoCall.id}`}
                            className="bg-violet-700 hover:bg-violet-800 py-3 px-5 rounded-lg duration-300 transition-all text-slate-50"
                          >
                            Review your date
                          </Link>
                        )
                      ) : (
                        <Link
                          href={`/video-call/schedule/${videoCall.id}`}
                          className="bg-amber-700 hover:bg-amber-800 py-3 px-5 rounded-lg duration-300 transition-all text-slate-50"
                        >
                          Select a date
                        </Link>
                      )}
                    </div>
                  </div>
                ))
            ) : role === "mentor" ? (
              videoCallRecords
                .filter((vcr) => vcr.status === "pending")
                .map((videoCall) => (
                  <div
                    key={videoCall.id}
                    className="flex flex-col bg-orange-200 px-4 py-3 rounded-sm gap-3"
                  >
                    <div>
                      <div className="flex">
                        <Image
                          src={videoCall.studentProfile.imageUrl || ""}
                          width={120}
                          height={120}
                          alt=""
                          className="rounded-full"
                        />
                        <p className="bg-indigo-600 text-white rounded-full h-fit py-2 px-3 font-medium">
                          {videoCall.status}
                        </p>
                      </div>
                      <h1>Student: {videoCall.studentProfile.user.name}</h1>
                    </div>
                    <div>
                      <p className="">
                        Purchased for:
                        <span className="underline">
                          {videoCall.mentorProfile.user.name}
                        </span>
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div>
                        <p className="text-muted-foreground text-sm">
                          Please select a preferred date for your video call to
                          be scheduled with the student.
                        </p>
                      </div>

                      {videoCall.preferredTime &&
                      videoCall.preferredTime.mentorPreferredTime ? (
                        <Link
                          href={`/video-call/respond/${videoCall.id}`}
                          className="bg-violet-700 hover:bg-violet-800 py-3 px-5 rounded-lg duration-300 transition-all text-slate-50"
                        >
                          Review your date
                        </Link>
                      ) : (
                        <Link
                          href={`/video-call/respond/${videoCall.id}`}
                          className="bg-amber-700 hover:bg-amber-800 py-3 px-5 rounded-lg duration-300 transition-all text-slate-50"
                        >
                          Select a date
                        </Link>
                      )}
                    </div>
                  </div>
                ))
            ) : (
              <div className="flex flex-col items-center justify-center">
                <h1>Invalid Role</h1>
                <Link
                  href="/select-role"
                  className="bg-amber-700 hover:bg-amber-800 transition-all duration-300"
                >
                  Select role
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
      {status === "scheduled" && (
        <div className="flex flex-col gap-5 px-15 py-5">
          <h1>Scheduled video call status</h1>
          <div className="flex gap-5">
            <Link
              href="/video-call?status=completed"
              className="bg-green-400 hover:bg-green-500 transition-all duration-300 py-2 px-5 rounded-lg text-slate-600 font-medium"
            >
              Completed
            </Link>
            <Link
              href="/video-call?status=pending"
              className="bg-blue-400 hover:bg-blue-500 transition-all duration-300 py-2 px-5 rounded-lg text-slate-600 font-medium"
            >
              Pending
            </Link>
            <Link
              href="/video-call?status=cancelled"
              className="bg-red-400 hover:bg-red-500 transition-all duration-300 py-2 px-5 rounded-lg text-slate-600 font-medium"
            >
              Cancelled
            </Link>
          </div>
        </div>
      )}
      {status === "completed" && (
        <div className="flex flex-col gap-5 px-15 py-5">
          <h1>Completed video call status</h1>
          <div className="flex gap-5">
            <Link
              href="/video-call?status=pending"
              className="bg-green-400 hover:bg-green-500 transition-all duration-300 py-2 px-5 rounded-lg text-slate-600 font-medium"
            >
              Pending
            </Link>
            <Link
              href="/video-call?status=scheduled"
              className="bg-blue-400 hover:bg-blue-500 transition-all duration-300 py-2 px-5 rounded-lg text-slate-600 font-medium"
            >
              Scheduled
            </Link>
            <Link
              href="/video-call?status=cancelled"
              className="bg-red-400 hover:bg-red-500 transition-all duration-300 py-2 px-5 rounded-lg text-slate-600 font-medium"
            >
              Cancelled
            </Link>
          </div>
        </div>
      )}
      {status === "cancelled" && (
        <div className="flex flex-col gap-5 px-15 py-5">
          <h1>Cancelled video call status</h1>
          <div className="flex gap-5">
            <Link
              href="/video-call?status=completed"
              className="bg-green-400 hover:bg-green-500 transition-all duration-300 py-2 px-5 rounded-lg text-slate-600 font-medium"
            >
              Completed
            </Link>
            <Link
              href="/video-call?status=scheduled"
              className="bg-blue-400 hover:bg-blue-500 transition-all duration-300 py-2 px-5 rounded-lg text-slate-600 font-medium"
            >
              Scheduled
            </Link>
            <Link
              href="/video-call?status=pending"
              className="bg-indigo-400 hover:bg-indigo-500 transition-all duration-300 py-2 px-5 rounded-lg text-slate-600 font-medium"
            >
              Pending
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
