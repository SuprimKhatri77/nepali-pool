"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { VideoCallWithStudentAndMentor } from "../../types/all-types";

export default function VideoCallApplicationsPage({
  videoCallRecords,
}: {
  videoCallRecords: VideoCallWithStudentAndMentor[];
}) {
  const params = useSearchParams();
  const status = params.get("status");
  return (
    <div>
      {(status === "pending" || !status) && (
        <div className="flex flex-col gap-5 px-15 py-5">
          <h1>Pending video call status</h1>
          <div className="flex gap-5">
            <Link
              href="/admin/video-call-applications"
              className="bg-green-400 hover:bg-green-500 transition-all duration-300 py-2 px-5 rounded-lg text-slate-600 font-medium"
            >
              All
            </Link>
            <Link
              href="/admin/video-call-applications?status=completed"
              className="bg-green-400 hover:bg-green-500 transition-all duration-300 py-2 px-5 rounded-lg text-slate-600 font-medium"
            >
              Completed
            </Link>
            <Link
              href="/admin/video-call-applications?status=scheduled"
              className="bg-blue-400 hover:bg-blue-500 transition-all duration-300 py-2 px-5 rounded-lg text-slate-600 font-medium"
            >
              Scheduled
            </Link>
            <Link
              href="/admin/video-call-applications?status=cancelled"
              className="bg-red-400 hover:bg-red-500 transition-all duration-300 py-2 px-5 rounded-lg text-slate-600 font-medium"
            >
              Cancelled
            </Link>
          </div>

          <div className="flex max-w-5xl mx-auto bg-slate-200 w-full py-7 px-8 rounded-lg gap-7">
            {videoCallRecords
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
                    <h1>{videoCall.studentProfile.user.name}</h1>
                  </div>
                  <div>
                    <p className="">
                      Purchased video call pack for:{" "}
                      <span className="underline">
                        {videoCall.mentorProfile.user.name}
                      </span>
                    </p>
                  </div>
                  <Link
                    href={`/admin/video-call-applications/schedule-video-call/${videoCall.id}`}
                    className="bg-amber-700 hover:bg-amber-800 py-3 px-5 rounded-lg duration-300 transition-all text-slate-50"
                  >
                    Schedule video call
                  </Link>
                </div>
              ))}
          </div>
        </div>
      )}
      {status === "scheduled" && (
        <div className="flex flex-col gap-5 px-15 py-5">
          <h1>Scheduled video call status</h1>
          <div className="flex gap-5">
              <Link
              href="/admin/video-call-applications"
              className="bg-green-400 hover:bg-green-500 transition-all duration-300 py-2 px-5 rounded-lg text-slate-600 font-medium"
            >
              All
            </Link>
            <Link
              href="/admin/video-call-applications?status=completed"
              className="bg-green-400 hover:bg-green-500 transition-all duration-300 py-2 px-5 rounded-lg text-slate-600 font-medium"
            >
              Completed
            </Link>
            <Link
              href="/admin/video-call-applications?status=pending"
              className="bg-blue-400 hover:bg-blue-500 transition-all duration-300 py-2 px-5 rounded-lg text-slate-600 font-medium"
            >
              Pending
            </Link>
            <Link
              href="/admin/video-call-applications?status=cancelled"
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
              href="/admin/video-call-applications"
              className="bg-green-400 hover:bg-green-500 transition-all duration-300 py-2 px-5 rounded-lg text-slate-600 font-medium"
            >
              All
            </Link>
            <Link
              href="/admin/video-call-applications?status=pending"
              className="bg-green-400 hover:bg-green-500 transition-all duration-300 py-2 px-5 rounded-lg text-slate-600 font-medium"
            >
              Pending
            </Link>
            <Link
              href="/admin/video-call-applications?status=scheduled"
              className="bg-blue-400 hover:bg-blue-500 transition-all duration-300 py-2 px-5 rounded-lg text-slate-600 font-medium"
            >
              Scheduled
            </Link>
            <Link
              href="/admin/video-call-applications?status=cancelled"
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
              href="/admin/video-call-applications?status=completed"
              className="bg-green-400 hover:bg-green-500 transition-all duration-300 py-2 px-5 rounded-lg text-slate-600 font-medium"
            >
              Completed
            </Link>
            <Link
              href="/admin/video-call-applications?status=scheduled"
              className="bg-blue-400 hover:bg-blue-500 transition-all duration-300 py-2 px-5 rounded-lg text-slate-600 font-medium"
            >
              Scheduled
            </Link>
            <Link
              href="/admin/video-call-applications?status=pending"
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
