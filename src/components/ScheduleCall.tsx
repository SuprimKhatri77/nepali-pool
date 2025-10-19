"use client";
import { useActionState, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { DateTimePicker } from "./ui/date-time-picker";
import {
  type FormState,
  scheduleVideoCallTime,
} from "../../server/actions/schedule-video-call/scheduleCall";

import { toast } from "sonner";
import { getVideoCallRecordWithStudentAndMentor } from "../../server/helper/getVideoCallRecordWithStudentAndMenotr";
import Image from "next/image";
import { usePathname } from "next/navigation";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { sendVideoCallSchedule } from "../../server/actions/send-video-call-schedule/sendVideoCallSchedule";
import type { VideoCallWithStudentAndMentor } from "../../types/all-types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Spinner } from "./ui/spinner";
import { Badge } from "./ui/badge";
import {
  Calendar,
  Clock,
  Video,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";

export default function ScheduleCall({
  videoId,
  onSuccess,
  role,
}: {
  videoId: string;
  onSuccess?: (bool: boolean) => void;
  role: "student" | "mentor";
}) {
  const initialState: FormState = {
    errors: {},
    message: "",
    success: false,
    timestamp: new Date(),
    role,
  } as FormState;
  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    scheduleVideoCallTime,
    initialState
  );

  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState<string>("10:30:00");
  const [videoRecord, setVideoRecord] =
    useState<VideoCallWithStudentAndMentor | null>(null);
  const [pending, setPending] = useState<boolean>(false);
  const [errors, setErrors] = useState<
    | {
        date?: string[] | undefined;
        videoId?: string[] | undefined;
        // time?: string[] | undefined;
        role?: string[] | undefined;
        studentId?: string[] | undefined;
        mentorId?: string[] | undefined;
      }
    | undefined
  >(undefined);
  const [isRejected, setIsRejected] = useState<boolean>(false);
  const pathname = usePathname();
  const isVideoCallRoute = pathname.startsWith("/video-call");
  const [scheduleSuccess, setScheduleSuccess] = useState<boolean>(false);
  useEffect(() => {
    const fetchData = async () => {
      const data = await getVideoCallRecordWithStudentAndMentor(videoId);
      if (data.success) {
        setVideoRecord(data.videoCallRecordWithStudentAndMentor);
      }
      if (!data.success) {
        toast.error(data.message);
        setVideoRecord(null);
      }
    };
    fetchData();
  }, [videoId, state.timestamp, scheduleSuccess]);

  useEffect(() => {
    if (state.success && state.message) {
      setIsRejected(false);
      toast.success(state.message);
      onSuccess?.(true);
    }
    if (!state.success && state.message) {
      toast.error(state.message);
    }
  }, [state.success, state.message, state.timestamp, onSuccess]);

  if (!videoRecord) {
    return (
      <div
        suppressHydrationWarning
        className="flex items-center justify-center min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 px-4"
      >
        <Spinner />
      </div>
    );
  }

  const handleAccept = async () => {
    setPending(true);
    const studentId = videoRecord.studentId;
    const mentorId = videoRecord.mentorId;

    if (!role || !videoId || !studentId || !mentorId) {
      toast.warning("Something went wrong");
      return;
    }
    let date: string;
    if (role === "student" && videoRecord.preferredTime.mentorPreferredTime) {
      date = videoRecord.preferredTime.mentorPreferredTime.toLocaleString(
        "en-US",
        {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }
      );
    } else if (
      role === "mentor" &&
      videoRecord.preferredTime.studentPreferredTime
    ) {
      date = videoRecord.preferredTime.studentPreferredTime.toLocaleString(
        "en-US",
        {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }
      );
    } else {
      toast.error("invalid attempt to schedule a call");
      return;
    }

    try {
      const result = await sendVideoCallSchedule(
        videoId,
        date,
        role,
        // time,
        studentId,
        mentorId
      );

      if (result.success && result.message) {
        toast.success(result.message);
        setScheduleSuccess(true);
      } else if (!result.success && result.message && result.errors) {
        toast.error(result.message);
        setErrors(result.errors);
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setPending(false);
    }
  };
  //   : "";

  return (
    <div
      className={`flex items-center justify-center ${isVideoCallRoute && "min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50"} w-full flex-col gap-4 sm:gap-6 md:gap-8 py-6 sm:py-8 md:py-12 px-3 sm:px-4 md:px-6`}
    >
      {isVideoCallRoute && (
        <div className="w-full max-w-3xl px-2 sm:px-0">
          <Breadcrumb>
            <BreadcrumbList className="flex-wrap text-xs sm:text-sm">
              <BreadcrumbItem>
                <BreadcrumbLink
                  href={`/dashboard/${role === "mentor" ? "mentor" : "student"}`}
                  className="text-emerald-600 hover:text-emerald-700 transition-colors"
                >
                  Dashboard
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-gray-400" />
              <BreadcrumbItem>
                <BreadcrumbLink
                  href="/video-call"
                  className="text-emerald-600 hover:text-emerald-700 transition-colors"
                >
                  Video Calls
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-gray-400" />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-gray-900 font-medium">
                  {role === "mentor"
                    ? "Respond to Schedule"
                    : "Schedule Meeting"}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      )}

      {role === "student" ? (
        videoRecord?.preferredTime &&
        videoRecord.preferredTime.studentPreferredTime ? (
          videoRecord.preferredTime.status === "pending" ? (
            <Card className="w-full max-w-3xl shadow-sm border border-emerald-100/50 bg-white/80 backdrop-blur mx-3 sm:mx-4">
              <CardHeader className="space-y-1 pb-4 sm:pb-6 px-4 sm:px-6">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg sm:text-xl md:text-2xl text-gray-900">
                      Schedule Status
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1">
                      Track your video call scheduling progress
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6">
                <div className="rounded-lg border border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50 p-4 sm:p-6">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <div className="space-y-1 sm:space-y-2 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                        <h3 className="text-xs sm:text-sm font-semibold text-emerald-900">
                          Your Proposed Time
                        </h3>
                        <Badge
                          variant="secondary"
                          className="bg-emerald-100 text-emerald-700 border-0 text-xs"
                        >
                          Sent
                        </Badge>
                      </div>
                      <p className="text-sm sm:text-base md:text-lg font-medium text-gray-900 break-words">
                        {videoRecord.preferredTime.studentPreferredTime.toLocaleString(
                          "en-US",
                          {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {videoRecord.preferredTime.mentorPreferredTime ? (
                  videoRecord.preferredTime.mentorPreferredTime !==
                    videoRecord.preferredTime.studentPreferredTime &&
                  videoRecord.preferredTime.lastSentBy === "mentor" ? (
                    <div className="space-y-3 sm:space-y-4">
                      <div className="rounded-lg border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-4 sm:p-6">
                        <div className="flex items-start gap-2 sm:gap-3">
                          <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                          <div className="space-y-2 sm:space-y-3 flex-1 min-w-0">
                            <div>
                              <h3 className="text-xs sm:text-sm font-semibold text-amber-900 mb-1.5 sm:mb-2">
                                Mentor&apos;s Counter-Proposal
                              </h3>
                              <p className="text-sm sm:text-base md:text-lg font-medium text-gray-900 break-words">
                                {videoRecord.preferredTime.mentorPreferredTime.toLocaleString(
                                  "en-US",
                                  {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )}
                              </p>
                            </div>
                            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                              Your mentor has suggested an alternative time.
                              Please review and accept if it works for you, or
                              propose a different time that fits your schedule.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-1 sm:pt-2">
                              <Button
                                className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all duration-200 text-xs sm:text-sm h-9 sm:h-10"
                                disabled={isRejected || pending}
                                onClick={handleAccept}
                              >
                                {pending ? <Spinner /> : "Accept This Time"}
                              </Button>
                              <Button
                                variant="outline"
                                className="border-gray-300 hover:bg-gray-50 transition-all duration-200 text-xs sm:text-sm h-9 sm:h-10"
                                onClick={() => setIsRejected(true)}
                                disabled={isRejected || pending}
                              >
                                Propose Different Time
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {isRejected && !state.success && (
                        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
                          <Card className="w-full max-w-lg shadow-2xl border-0 max-h-[90vh] overflow-y-auto">
                            <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
                              <CardTitle className="text-base sm:text-lg md:text-xl text-gray-900">
                                Propose New Time
                              </CardTitle>
                              <CardDescription className="text-xs sm:text-sm">
                                Select a date and time that works better for you
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
                              <form
                                action={formAction}
                                className="space-y-4 sm:space-y-5"
                              >
                                <DateTimePicker
                                  onDateChange={setDate}
                                  onTimeChange={setTime}
                                  date={date}
                                  time={time}
                                />
                                {state.errors?.date && (
                                  <p className="text-xs sm:text-sm text-red-600 flex items-center gap-2">
                                    <XCircle className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                                    <span className="break-words">
                                      {state.errors.date[0]}
                                    </span>
                                  </p>
                                )}
                                {state.errors?.time && (
                                  <p className="text-xs sm:text-sm text-red-600 flex items-center gap-2">
                                    <XCircle className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                                    <span className="break-words">
                                      {state.errors.time[0]}
                                    </span>
                                  </p>
                                )}
                                <input
                                  type="hidden"
                                  name="date"
                                  value={
                                    date
                                      ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
                                      : ""
                                  }
                                />
                                <input type="hidden" name="time" value={time} />
                                <input
                                  type="hidden"
                                  name="videoId"
                                  value={videoId}
                                />
                                <input type="hidden" name="role" value={role} />

                                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-1 sm:pt-2">
                                  <Button
                                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 shadow-sm text-xs sm:text-sm h-9 sm:h-10"
                                    type="submit"
                                    disabled={!date || isPending || !videoId}
                                  >
                                    {isPending ? <Spinner /> : "Send Proposal"}
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsRejected(false)}
                                    className="flex-1 text-xs sm:text-sm h-9 sm:h-10"
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </form>
                            </CardContent>
                          </Card>
                        </div>
                      )}
                    </div>
                  ) : (
                    videoRecord.preferredTime.mentorPreferredTime &&
                    videoRecord.preferredTime.studentPreferredTime !==
                      videoRecord.preferredTime.mentorPreferredTime &&
                    videoRecord.preferredTime.lastSentBy === "student" && (
                      <div className="rounded-lg border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-6">
                        <div className="flex items-start gap-2 sm:gap-3">
                          <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <h3 className="text-xs sm:text-sm font-semibold text-blue-900 mb-1">
                              Waiting for Response
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-700">
                              Your new time proposal has been sent to the mentor
                              for review
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  )
                ) : (
                  <div className="rounded-lg border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-6">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="text-xs sm:text-sm font-semibold text-blue-900 mb-1">
                          Awaiting Mentor Response
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-700">
                          Your mentor will review your proposed time and respond
                          shortly
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : videoRecord.preferredTime.status === "accepted" ? (
            <Card className="w-full max-w-2xl shadow-sm border border-emerald-200 bg-white/80 backdrop-blur mx-3 sm:mx-4">
              <CardContent className="p-6 sm:p-8">
                <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4">
                  <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-emerald-100 flex items-center justify-center">
                    <CheckCircle2 className="h-6 w-6 sm:h-8 sm:w-8 text-emerald-600" />
                  </div>
                  <div className="space-y-1.5 sm:space-y-2">
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                      Meeting Confirmed!
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600 max-w-md px-2">
                      Your video call has been scheduled. Check your email for
                      the meeting link and calendar invite.
                    </p>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-700 border-0 text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2">
                    Confirmation Sent
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="w-full max-w-2xl shadow-sm border border-red-200 bg-white/80 backdrop-blur mx-3 sm:mx-4">
              <CardContent className="p-6 sm:p-8">
                <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4">
                  <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-red-100 flex items-center justify-center">
                    <XCircle className="h-6 w-6 sm:h-8 sm:w-8 text-red-600" />
                  </div>
                  <div className="space-y-1.5 sm:space-y-2">
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                      Meeting Cancelled
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600 px-2">
                      This video call has been cancelled
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        ) : (
          <Card className="w-full max-w-lg shadow-sm border border-emerald-100/50 bg-white/80 backdrop-blur mx-3 sm:mx-4">
            <CardHeader className="text-center space-y-2 sm:space-y-3 pb-4 sm:pb-6 px-4 sm:px-6">
              <div className="mx-auto h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-gradient-to-br from-emerald-100 to-green-100 flex items-center justify-center">
                <Video className="h-6 w-6 sm:h-7 sm:w-7 text-emerald-600" />
              </div>
              <div>
                <CardTitle className="text-xl sm:text-2xl text-gray-900">
                  Schedule Your Meeting
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm text-gray-600 mt-1.5 sm:mt-2 px-2">
                  Choose a convenient time for your video call
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6">
              <div className="flex flex-col items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-100">
                <p className="text-xs sm:text-sm text-gray-600">Meeting with</p>
                <div className="flex items-center gap-2.5 sm:gap-3">
                  {videoRecord?.mentorProfile.imageUrl ? (
                    <Image
                      src={
                        videoRecord?.mentorProfile.imageUrl ||
                        "https://vbteadl6m3.ufs.sh/f/DDJ5nPL6Yp1sHfAviE2zasoidYb10Mu7JGNQFZWgVmCrRHPE"
                      }
                      alt="Mentor"
                      height={56}
                      width={56}
                      className="object-cover rounded-full h-12 w-12 sm:h-14 sm:w-14 ring-2 ring-emerald-200 flex-shrink-0"
                    />
                  ) : (
                    <Image
                      src="https://vbteadl6m3.ufs.sh/f/DDJ5nPL6Yp1sHfAviE2zasoidYb10Mu7JGNQFZWgVmCrRHPE"
                      alt="Mentor"
                      height={56}
                      width={56}
                      className="object-cover rounded-full h-12 w-12 sm:h-14 sm:w-14 ring-2 ring-emerald-200 flex-shrink-0"
                    />
                  )}
                  <div className="text-left min-w-0">
                    <p className="font-semibold text-base sm:text-lg capitalize text-gray-900 truncate">
                      {videoRecord?.mentorProfile.user?.name || "Mentor"}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600">
                      Your Mentor
                    </p>
                  </div>
                </div>
              </div>

              <form action={formAction} className="space-y-4 sm:space-y-5">
                <div className="space-y-2 sm:space-y-3">
                  <label className="text-xs sm:text-sm font-medium text-gray-700">
                    Select Date & Time
                  </label>
                  <DateTimePicker
                    onDateChange={setDate}
                    onTimeChange={setTime}
                    date={date}
                    time={time}
                  />
                  {state.errors?.date && (
                    <p className="text-xs sm:text-sm text-red-600 flex items-center gap-2">
                      <XCircle className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span className="break-words">
                        {state.errors.date[0]}
                      </span>
                    </p>
                  )}
                  {state.errors?.time && (
                    <p className="text-xs sm:text-sm text-red-600 flex items-center gap-2">
                      <XCircle className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span className="break-words">
                        {state.errors.time[0]}
                      </span>
                    </p>
                  )}
                </div>
                <input
                  type="hidden"
                  name="date"
                  value={
                    date
                      ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
                      : ""
                  }
                />
                <input type="hidden" name="time" value={time} />
                <input type="hidden" name="videoId" value={videoId} />
                <input type="hidden" name="role" value={role} />

                <Button
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all duration-200 h-10 sm:h-11 text-xs sm:text-sm"
                  type="submit"
                  disabled={!date || isPending || !videoId}
                >
                  {isPending ? <Spinner /> : "Send Schedule Request"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )
      ) : role === "mentor" ? (
        videoRecord?.preferredTime &&
        videoRecord.preferredTime.studentPreferredTime ? (
          videoRecord.preferredTime.status === "pending" ? (
            <Card className="w-full max-w-3xl shadow-sm border border-emerald-100/50 bg-white/80 backdrop-blur mx-3 sm:mx-4">
              <CardHeader className="space-y-1 pb-4 sm:pb-6 px-4 sm:px-6">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg sm:text-xl md:text-2xl text-gray-900">
                      Schedule Request
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1">
                      Review the student&apos;s proposed meeting time
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6">
                <div className="rounded-lg border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-6">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="space-y-1 sm:space-y-2 min-w-0">
                      <h3 className="text-xs sm:text-sm font-semibold text-blue-900">
                        Student&apos;s Proposed Time
                      </h3>
                      <p className="text-sm sm:text-base md:text-lg font-medium text-gray-900 break-words">
                        {videoRecord.preferredTime.studentPreferredTime.toLocaleString(
                          "en-US",
                          {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {(videoRecord.preferredTime.studentPreferredTime &&
                  !videoRecord.preferredTime.mentorPreferredTime) ||
                (videoRecord.preferredTime.studentPreferredTime !==
                  videoRecord.preferredTime.mentorPreferredTime &&
                  videoRecord.preferredTime.lastSentBy === "student") ? (
                  <div className="space-y-3 sm:space-y-4">
                    <div className="rounded-lg border border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50 p-4 sm:p-6">
                      <div className="space-y-3 sm:space-y-4">
                        <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                          Please confirm if you&apos;re available at this time.
                          If not, you can propose an alternative time that works
                          better for your schedule.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                          <Button
                            className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all duration-200 text-xs sm:text-sm h-9 sm:h-10"
                            disabled={isRejected || pending}
                            onClick={handleAccept}
                          >
                            {pending ? <Spinner /> : "Confirm & Accept"}
                          </Button>
                          <Button
                            variant="outline"
                            className="border-gray-300 hover:bg-gray-50 transition-all duration-200 text-xs sm:text-sm h-9 sm:h-10"
                            onClick={() => setIsRejected(true)}
                            disabled={isRejected || pending}
                          >
                            Propose Different Time
                          </Button>
                        </div>
                      </div>
                    </div>

                    {isRejected && !state.success && (
                      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
                        <Card className="w-full max-w-lg shadow-2xl border-0 max-h-[90vh] overflow-y-auto">
                          <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
                            <CardTitle className="text-base sm:text-lg md:text-xl text-gray-900">
                              Propose Alternative Time
                            </CardTitle>
                            <CardDescription className="text-xs sm:text-sm">
                              Select a date and time that works for your
                              schedule
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
                            <form
                              action={formAction}
                              className="space-y-4 sm:space-y-5"
                            >
                              <DateTimePicker
                                onDateChange={setDate}
                                onTimeChange={setTime}
                                date={date}
                                time={time}
                              />
                              {state.errors?.date && (
                                <p className="text-xs sm:text-sm text-red-600 flex items-center gap-2">
                                  <XCircle className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                                  <span className="break-words">
                                    {state.errors.date[0]}
                                  </span>
                                </p>
                              )}
                              {state.errors?.time && (
                                <p className="text-xs sm:text-sm text-red-600 flex items-center gap-2">
                                  <XCircle className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                                  <span className="break-words">
                                    {state.errors.time[0]}
                                  </span>
                                </p>
                              )}
                              <input
                                type="hidden"
                                name="date"
                                value={
                                  date
                                    ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
                                    : ""
                                }
                              />
                              <input type="hidden" name="time" value={time} />
                              <input
                                type="hidden"
                                name="videoId"
                                value={videoId}
                              />
                              <input type="hidden" name="role" value={role} />

                              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-1 sm:pt-2">
                                <Button
                                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 shadow-sm text-xs sm:text-sm h-9 sm:h-10"
                                  type="submit"
                                  disabled={!date || isPending || !videoId}
                                >
                                  {isPending ? <Spinner /> : "Send Proposal"}
                                </Button>
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => setIsRejected(false)}
                                  className="flex-1 text-xs sm:text-sm h-9 sm:h-10"
                                >
                                  Cancel
                                </Button>
                              </div>
                            </form>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </div>
                ) : videoRecord.preferredTime.studentPreferredTime &&
                  videoRecord.preferredTime.mentorPreferredTime &&
                  videoRecord.preferredTime.studentPreferredTime !==
                    videoRecord.preferredTime.mentorPreferredTime &&
                  videoRecord.preferredTime.lastSentBy === "mentor" ? (
                  <div className="rounded-lg border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-6">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="text-xs sm:text-sm font-semibold text-blue-900 mb-1">
                          Waiting for Student Response
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-700">
                          Your alternative time proposal has been sent to the
                          student for review
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-lg border border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50 p-4 sm:p-6">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="text-xs sm:text-sm font-semibold text-emerald-900 mb-1">
                          Meeting Confirmed
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-700">
                          The student has confirmed your proposed time. Check
                          your email for the meeting link and details.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : videoRecord.preferredTime.status === "accepted" ? (
            <Card className="w-full max-w-2xl shadow-sm border border-emerald-200 bg-white/80 backdrop-blur mx-3 sm:mx-4">
              <CardContent className="p-6 sm:p-8">
                <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4">
                  <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-emerald-100 flex items-center justify-center">
                    <CheckCircle2 className="h-6 w-6 sm:h-8 sm:w-8 text-emerald-600" />
                  </div>
                  <div className="space-y-1.5 sm:space-y-2">
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                      Meeting Confirmed!
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600 max-w-md px-2">
                      Your video call has been scheduled successfully. Check
                      your email for the meeting link and calendar invite.
                    </p>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-700 border-0 text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2">
                    Confirmation Sent
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="w-full max-w-2xl shadow-sm border border-red-200 bg-white/80 backdrop-blur mx-3 sm:mx-4">
              <CardContent className="p-6 sm:p-8">
                <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4">
                  <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-red-100 flex items-center justify-center">
                    <XCircle className="h-6 w-6 sm:h-8 sm:w-8 text-red-600" />
                  </div>
                  <div className="space-y-1.5 sm:space-y-2">
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                      Meeting Cancelled
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600 px-2">
                      This video call has been cancelled
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        ) : (
          <Card className="w-full max-w-lg shadow-sm border border-emerald-100/50 bg-white/80 backdrop-blur mx-3 sm:mx-4">
            <CardHeader className="text-center space-y-2 sm:space-y-3 pb-4 sm:pb-6 px-4 sm:px-6">
              <div className="mx-auto h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-gradient-to-br from-emerald-100 to-green-100 flex items-center justify-center">
                <Clock className="h-6 w-6 sm:h-7 sm:w-7 text-emerald-600" />
              </div>
              <div>
                <CardTitle className="text-xl sm:text-2xl text-gray-900">
                  Awaiting Student
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm text-gray-600 mt-1.5 sm:mt-2 px-2">
                  The student hasn&apos;t selected a meeting time yet
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <div className="rounded-lg border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-6">
                <div className="flex items-start gap-2 sm:gap-3">
                  <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-xs sm:text-sm font-semibold text-blue-900 mb-1">
                      No Schedule Request Yet
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-700">
                      Once the student proposes a meeting time, you&apos;ll be
                      able to review and respond here.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      ) : (
        <Card className="w-full max-w-md shadow-sm border border-gray-200 bg-white/80 backdrop-blur mx-3 sm:mx-4">
          <CardContent className="p-6 sm:p-8 text-center space-y-3 sm:space-y-4">
            <div className="mx-auto h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-red-100 flex items-center justify-center">
              <XCircle className="h-6 w-6 sm:h-7 sm:w-7 text-red-600" />
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                Invalid Role
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 px-2">
                Please select a valid role to continue
              </p>
            </div>
            <Link href="/select-role">
              <Button
                variant="outline"
                className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 text-xs sm:text-sm h-9 sm:h-10"
              >
                Select Role
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
