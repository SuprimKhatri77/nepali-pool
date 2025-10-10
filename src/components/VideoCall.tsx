"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { VideoCallWithStudentAndMentor } from "../../types/all-types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function VideoCall({
  videoCallRecords,
  role,
}: {
  videoCallRecords: VideoCallWithStudentAndMentor[];
  role: string;
}) {
  const params = useSearchParams();
  const status = params.get("status");

  const renderVideoCallCards = (filterStatus: string) => {
    const filteredCalls = videoCallRecords.filter(
      (vcr) => vcr.status === filterStatus
    );

    if (filteredCalls.length === 0) {
      return (
        <div className="text-center py-12 text-gray-500">
          <p>No {filterStatus} video calls found.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {role === "student"
          ? filteredCalls.map((videoCall) => (
              <Card
                key={videoCall.id}
                className="overflow-hidden border-emerald-100 hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <Image
                      src={videoCall.mentorProfile.imageUrl || ""}
                      width={80}
                      height={80}
                      alt=""
                      className="rounded-full ring-2 ring-emerald-100"
                    />
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        filterStatus === "pending"
                          ? "bg-amber-100 text-amber-700"
                          : filterStatus === "scheduled"
                            ? "bg-blue-100 text-blue-700"
                            : filterStatus === "completed"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-red-100 text-red-700"
                      }`}
                    >
                      {videoCall.status}
                    </span>
                  </div>

                  <h3 className="font-semibold text-gray-900 mb-2">
                    Mentor: {videoCall.mentorProfile.user.name}
                  </h3>

                  <p className="text-sm text-gray-600 mb-4">
                    Purchased for:{" "}
                    <span className="font-medium">
                      {videoCall.mentorProfile.user.name}
                    </span>
                  </p>

                  {filterStatus === "pending" && (
                    <div className="space-y-3">
                      <div className="bg-emerald-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-700 mb-1">
                          Please select a preferred date for your video call
                        </p>
                        <p className="text-xs text-gray-500">
                          A mentor will review your preferred time and schedule
                          the video call or will send a new Date and Time which
                          the mentor is available at.
                        </p>
                      </div>

                      {videoCall.preferredTime ? (
                        videoCall.preferredTime.studentPreferredTime && (
                          <Link
                            href={`/video-call/schedule/${videoCall.id}`}
                            className="block"
                          >
                            <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                              Review your date
                            </Button>
                          </Link>
                        )
                      ) : (
                        <Link
                          href={`/video-call/schedule/${videoCall.id}`}
                          className="block"
                        >
                          <Button className="w-full bg-amber-600 hover:bg-amber-700">
                            Select a date
                          </Button>
                        </Link>
                      )}
                    </div>
                  )}

                  {filterStatus === "scheduled" && (
                    <div className="space-y-3">
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-700">
                          Your video call is scheduled
                        </p>
                      </div>
                      <Link
                        href={`/video-call/schedule/${videoCall.id}`}
                        className="block"
                      >
                        <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                          View details
                        </Button>
                      </Link>
                    </div>
                  )}

                  {filterStatus === "completed" && (
                    <div className="bg-emerald-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-700">
                        This video call has been completed
                      </p>
                    </div>
                  )}

                  {filterStatus === "cancelled" && (
                    <div className="bg-red-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-700">
                        This video call was cancelled
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          : role === "mentor"
            ? filteredCalls.map((videoCall) => (
                <Card
                  key={videoCall.id}
                  className="overflow-hidden border-emerald-100 hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <Image
                        src={videoCall.studentProfile.imageUrl || ""}
                        width={80}
                        height={80}
                        alt=""
                        className="rounded-full ring-2 ring-emerald-100"
                      />
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          filterStatus === "pending"
                            ? "bg-amber-100 text-amber-700"
                            : filterStatus === "scheduled"
                              ? "bg-blue-100 text-blue-700"
                              : filterStatus === "completed"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-red-100 text-red-700"
                        }`}
                      >
                        {videoCall.status}
                      </span>
                    </div>

                    <h3 className="font-semibold text-gray-900 mb-2">
                      Student: {videoCall.studentProfile.user.name}
                    </h3>

                    <p className="text-sm text-gray-600 mb-4">
                      Purchased for:{" "}
                      <span className="font-medium">
                        {videoCall.mentorProfile.user.name}
                      </span>
                    </p>

                    {filterStatus === "pending" && (
                      <div className="space-y-3">
                        <div className="bg-emerald-50 p-3 rounded-lg">
                          <p className="text-sm text-gray-700">
                            Please select a preferred date for your video call
                            to be scheduled with the student.
                          </p>
                        </div>

                        {videoCall.preferredTime &&
                        videoCall.preferredTime.mentorPreferredTime ? (
                          <Link
                            href={`/video-call/respond/${videoCall.id}`}
                            className="block"
                          >
                            <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                              Review your date
                            </Button>
                          </Link>
                        ) : (
                          <Link
                            href={`/video-call/respond/${videoCall.id}`}
                            className="block"
                          >
                            <Button className="w-full bg-amber-600 hover:bg-amber-700">
                              Select a date
                            </Button>
                          </Link>
                        )}
                      </div>
                    )}

                    {filterStatus === "scheduled" && (
                      <div className="space-y-3">
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <p className="text-sm text-gray-700">
                            Your video call is scheduled with the student
                          </p>
                        </div>
                        <Link
                          href={`/video-call/respond/${videoCall.id}`}
                          className="block"
                        >
                          <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                            View details
                          </Button>
                        </Link>
                      </div>
                    )}

                    {filterStatus === "completed" && (
                      <div className="bg-emerald-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-700">
                          This video call has been completed
                        </p>
                      </div>
                    )}

                    {filterStatus === "cancelled" && (
                      <div className="bg-red-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-700">
                          This video call was cancelled
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            : null}
      </div>
    );
  };

  if (role !== "student" && role !== "mentor") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-50 flex items-center justify-center p-6">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Invalid Role
            </h1>
            <Link href="/select-role">
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                Select role
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-50">
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-emerald-100">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            {status === "pending" || !status
              ? "Pending Video Calls"
              : status === "scheduled"
                ? "Scheduled Video Calls"
                : status === "completed"
                  ? "Completed Video Calls"
                  : "Cancelled Video Calls"}
          </h1>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/video-call?status=pending"
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                status === "pending" || !status
                  ? "bg-amber-600 text-white shadow-sm"
                  : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              Pending
            </Link>
            <Link
              href="/video-call?status=scheduled"
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                status === "scheduled"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              Scheduled
            </Link>
            <Link
              href="/video-call?status=completed"
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                status === "completed"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              Completed
            </Link>
            <Link
              href="/video-call?status=cancelled"
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                status === "cancelled"
                  ? "bg-red-600 text-white shadow-sm"
                  : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              Cancelled
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {(status === "pending" || !status) && renderVideoCallCards("pending")}
        {status === "scheduled" && renderVideoCallCards("scheduled")}
        {status === "completed" && renderVideoCallCards("completed")}
        {status === "cancelled" && renderVideoCallCards("cancelled")}
      </div>
    </div>
  );
}
