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
import { usePathname, useRouter } from "next/navigation";
import Loader from "./Loader";

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
        time?: string[] | undefined;
        role?: string[] | undefined;
        studentId?: string[] | undefined;
        mentorId?: string[] | undefined;
      }
    | undefined
  >(undefined);
  const router = useRouter();
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
  }, [state.success, state.message, state.timestamp]);

  if (!videoRecord) {
    return (
      <div
        suppressHydrationWarning
        className="flex items-center justify-center min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50"
      >
        <Spinner />
      </div>
    );
  }

  const handleAccept = async () => {
    const studentId = videoRecord.studentId;
    const mentorId = videoRecord.mentorId;
    setPending(true);

    if (!role || !date || !videoId || !studentId || !mentorId) {
      toast.warning("Something went wrong");
      return;
    }

    const result = await sendVideoCallSchedule(
      videoId,
      String(date),
      role,
      time,
      studentId,
      mentorId
    );

    if (result.success && result.message) {
      toast.success(result.message);
      setScheduleSuccess(true);
    } else if (!result.success && result.message && result.errors) {
      toast.error(result.message);
      setErrors(result.errors);
      setPending(false);
    }
    setPending(false);
  };

  return (
    <div
      className={`flex items-center justify-center ${isVideoCallRoute && "min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50"} w-full flex-col gap-8 py-12 px-4`}
    >
      {isVideoCallRoute && (
        <div className="w-full max-w-3xl">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink
                  href="/dashboard/student"
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
            <Card className="w-full max-w-3xl shadow-sm border border-emerald-100/50 bg-white/80 backdrop-blur">
              <CardHeader className="space-y-1 pb-6">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-gray-900">
                      Schedule Status
                    </CardTitle>
                    <CardDescription className="text-gray-600 mt-1">
                      Track your video call scheduling progress
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-lg border border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50 p-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-emerald-900">
                          Your Proposed Time
                        </h3>
                        <Badge
                          variant="secondary"
                          className="bg-emerald-100 text-emerald-700 border-0"
                        >
                          Sent
                        </Badge>
                      </div>
                      <p className="text-lg font-medium text-gray-900">
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
                    <div className="space-y-4">
                      <div className="rounded-lg border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-6">
                        <div className="flex items-start gap-3">
                          <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                          <div className="space-y-3 flex-1">
                            <div>
                              <h3 className="text-sm font-semibold text-amber-900 mb-2">
                                Mentor's Counter-Proposal
                              </h3>
                              <p className="text-lg font-medium text-gray-900">
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
                            <p className="text-sm text-gray-700 leading-relaxed">
                              Your mentor has suggested an alternative time.
                              Please review and accept if it works for you, or
                              propose a different time that fits your schedule.
                            </p>
                            <div className="flex gap-3 pt-2">
                              <Button
                                className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all duration-200"
                                disabled={isRejected || pending}
                                onClick={handleAccept}
                              >
                                {pending ? <Spinner /> : "Accept This Time"}
                              </Button>
                              <Button
                                variant="outline"
                                className="border-gray-300 hover:bg-gray-50 transition-all duration-200"
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
                        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                          <Card className="w-full max-w-lg shadow-2xl border-0">
                            <CardHeader>
                              <CardTitle className="text-xl text-gray-900">
                                Propose New Time
                              </CardTitle>
                              <CardDescription>
                                Select a date and time that works better for you
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <form action={formAction} className="space-y-5">
                                <DateTimePicker
                                  onDateChange={setDate}
                                  onTimeChange={setTime}
                                  date={date}
                                  time={time}
                                />
                                {state.errors?.date && (
                                  <p className="text-sm text-red-600 flex items-center gap-2">
                                    <XCircle className="h-4 w-4" />
                                    {state.errors.date[0]}
                                  </p>
                                )}
                                {state.errors?.time && (
                                  <p className="text-sm text-red-600 flex items-center gap-2">
                                    <XCircle className="h-4 w-4" />
                                    {state.errors.time[0]}
                                  </p>
                                )}
                                <input
                                  type="hidden"
                                  name="date"
                                  value={String(date)}
                                />
                                <input type="hidden" name="time" value={time} />
                                <input
                                  type="hidden"
                                  name="videoId"
                                  value={videoId}
                                />
                                <input type="hidden" name="role" value={role} />

                                <div className="flex gap-3 pt-2">
                                  <Button
                                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 shadow-sm"
                                    type="submit"
                                    disabled={!date || isPending || !videoId}
                                  >
                                    {isPending ? (
                                      <Loader borderColor="green" />
                                    ) : (
                                      "Send Proposal"
                                    )}
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsRejected(false)}
                                    className="flex-1"
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
                      <div className="rounded-lg border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
                        <div className="flex items-start gap-3">
                          <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
                          <div>
                            <h3 className="text-sm font-semibold text-blue-900 mb-1">
                              Waiting for Response
                            </h3>
                            <p className="text-sm text-gray-700">
                              Your new time proposal has been sent to the mentor
                              for review
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  )
                ) : (
                  <div className="rounded-lg border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <h3 className="text-sm font-semibold text-blue-900 mb-1">
                          Awaiting Mentor Response
                        </h3>
                        <p className="text-sm text-gray-700">
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
            <Card className="w-full max-w-2xl shadow-sm border border-emerald-200 bg-white/80 backdrop-blur">
              <CardContent className="p-8">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center">
                    <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-2xl font-semibold text-gray-900">
                      Meeting Confirmed!
                    </h2>
                    <p className="text-gray-600 max-w-md">
                      Your video call has been scheduled. Check your email for
                      the meeting link and calendar invite.
                    </p>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-700 border-0 text-sm px-4 py-2">
                    Confirmation Sent
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="w-full max-w-2xl shadow-sm border border-red-200 bg-white/80 backdrop-blur">
              <CardContent className="p-8">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center">
                    <XCircle className="h-8 w-8 text-red-600" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-2xl font-semibold text-gray-900">
                      Meeting Cancelled
                    </h2>
                    <p className="text-gray-600">
                      This video call has been cancelled
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        ) : (
          <Card className="w-full max-w-lg shadow-sm border border-emerald-100/50 bg-white/80 backdrop-blur">
            <CardHeader className="text-center space-y-3 pb-6">
              <div className="mx-auto h-14 w-14 rounded-full bg-gradient-to-br from-emerald-100 to-green-100 flex items-center justify-center">
                <Video className="h-7 w-7 text-emerald-600" />
              </div>
              <div>
                <CardTitle className="text-2xl text-gray-900">
                  Schedule Your Meeting
                </CardTitle>
                <CardDescription className="text-gray-600 mt-2">
                  Choose a convenient time for your video call
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center gap-4 p-4 rounded-lg bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-100">
                <p className="text-sm text-gray-600">Meeting with</p>
                <div className="flex items-center gap-3">
                  {videoRecord?.mentorProfile.imageUrl ? (
                    <Image
                      src={
                        videoRecord?.mentorProfile.imageUrl ||
                        "https://vbteadl6m3.ufs.sh/f/DDJ5nPL6Yp1sHfAviE2zasoidYb10Mu7JGNQFZWgVmCrRHPE"
                      }
                      alt="Mentor"
                      height={56}
                      width={56}
                      className="object-cover rounded-full h-14 w-14 ring-2 ring-emerald-200"
                    />
                  ) : (
                    <Image
                      src="https://vbteadl6m3.ufs.sh/f/DDJ5nPL6Yp1sHfAviE2zasoidYb10Mu7JGNQFZWgVmCrRHPE"
                      alt="Mentor"
                      height={56}
                      width={56}
                      className="object-cover rounded-full h-14 w-14 ring-2 ring-emerald-200"
                    />
                  )}
                  <div className="text-left">
                    <p className="font-semibold text-lg capitalize text-gray-900">
                      {videoRecord?.mentorProfile.user?.name || "Mentor"}
                    </p>
                    <p className="text-sm text-gray-600">Your Mentor</p>
                  </div>
                </div>
              </div>

              <form action={formAction} className="space-y-5">
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700">
                    Select Date & Time
                  </label>
                  <DateTimePicker
                    onDateChange={setDate}
                    onTimeChange={setTime}
                    date={date}
                    time={time}
                  />
                  {state.errors?.date && (
                    <p className="text-sm text-red-600 flex items-center gap-2">
                      <XCircle className="h-4 w-4" />
                      {state.errors.date[0]}
                    </p>
                  )}
                  {state.errors?.time && (
                    <p className="text-sm text-red-600 flex items-center gap-2">
                      <XCircle className="h-4 w-4" />
                      {state.errors.time[0]}
                    </p>
                  )}
                </div>
                <input type="hidden" name="date" value={String(date)} />
                <input type="hidden" name="time" value={time} />
                <input type="hidden" name="videoId" value={videoId} />
                <input type="hidden" name="role" value={role} />

                <Button
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all duration-200 h-11"
                  type="submit"
                  disabled={!date || isPending || !videoId}
                >
                  {isPending ? <Loader /> : "Send Schedule Request"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )
      ) : role === "mentor" ? (
        videoRecord?.preferredTime &&
        videoRecord.preferredTime.studentPreferredTime ? (
          videoRecord.preferredTime.status === "pending" ? (
            <Card className="w-full max-w-3xl shadow-sm border border-emerald-100/50 bg-white/80 backdrop-blur">
              <CardHeader className="space-y-1 pb-6">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-gray-900">
                      Schedule Request
                    </CardTitle>
                    <CardDescription className="text-gray-600 mt-1">
                      Review the student's proposed meeting time
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-lg border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="space-y-2">
                      <h3 className="text-sm font-semibold text-blue-900">
                        Student's Proposed Time
                      </h3>
                      <p className="text-lg font-medium text-gray-900">
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
                  <div className="space-y-4">
                    <div className="rounded-lg border border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50 p-6">
                      <div className="space-y-4">
                        <p className="text-sm text-gray-700 leading-relaxed">
                          Please confirm if you're available at this time. If
                          not, you can propose an alternative time that works
                          better for your schedule.
                        </p>
                        <div className="flex gap-3">
                          <Button
                            className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all duration-200"
                            disabled={isRejected || pending}
                            onClick={handleAccept}
                          >
                            {pending ? (
                              <Loader from="respond" />
                            ) : (
                              "Confirm & Accept"
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            className="border-gray-300 hover:bg-gray-50 transition-all duration-200"
                            onClick={() => setIsRejected(true)}
                            disabled={isRejected || pending}
                          >
                            Propose Different Time
                          </Button>
                        </div>
                      </div>
                    </div>

                    {isRejected &&
                      !videoRecord.preferredTime.mentorPreferredTime && (
                        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                          <Card className="w-full max-w-lg shadow-2xl border-0">
                            <CardHeader>
                              <CardTitle className="text-xl text-gray-900">
                                Propose Alternative Time
                              </CardTitle>
                              <CardDescription>
                                Select a date and time that works for your
                                schedule
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <form action={formAction} className="space-y-5">
                                <DateTimePicker
                                  onDateChange={setDate}
                                  onTimeChange={setTime}
                                  date={date}
                                  time={time}
                                />
                                {state.errors?.date && (
                                  <p className="text-sm text-red-600 flex items-center gap-2">
                                    <XCircle className="h-4 w-4" />
                                    {state.errors.date[0]}
                                  </p>
                                )}
                                {state.errors?.time && (
                                  <p className="text-sm text-red-600 flex items-center gap-2">
                                    <XCircle className="h-4 w-4" />
                                    {state.errors.time[0]}
                                  </p>
                                )}
                                <input
                                  type="hidden"
                                  name="date"
                                  value={String(date)}
                                />
                                <input type="hidden" name="time" value={time} />
                                <input
                                  type="hidden"
                                  name="videoId"
                                  value={videoId}
                                />
                                <input type="hidden" name="role" value={role} />

                                <div className="flex gap-3 pt-2">
                                  <Button
                                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 shadow-sm"
                                    type="submit"
                                    disabled={!date || isPending || !videoId}
                                  >
                                    {isPending ? (
                                      <Loader borderColor="green" />
                                    ) : (
                                      "Send Proposal"
                                    )}
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsRejected(false)}
                                    className="flex-1"
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
                  <div className="rounded-lg border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <h3 className="text-sm font-semibold text-blue-900 mb-1">
                          Waiting for Student Response
                        </h3>
                        <p className="text-sm text-gray-700">
                          Your alternative time proposal has been sent to the
                          student for review
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-lg border border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50 p-6">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5" />
                      <div>
                        <h3 className="text-sm font-semibold text-emerald-900 mb-1">
                          Meeting Confirmed
                        </h3>
                        <p className="text-sm text-gray-700">
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
            <Card className="w-full max-w-2xl shadow-sm border border-emerald-200 bg-white/80 backdrop-blur">
              <CardContent className="p-8">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center">
                    <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-2xl font-semibold text-gray-900">
                      Meeting Confirmed!
                    </h2>
                    <p className="text-gray-600 max-w-md">
                      Your video call has been scheduled successfully. Check
                      your email for the meeting link and calendar invite.
                    </p>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-700 border-0 text-sm px-4 py-2">
                    Confirmation Sent
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="w-full max-w-2xl shadow-sm border border-red-200 bg-white/80 backdrop-blur">
              <CardContent className="p-8">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center">
                    <XCircle className="h-8 w-8 text-red-600" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-2xl font-semibold text-gray-900">
                      Meeting Cancelled
                    </h2>
                    <p className="text-gray-600">
                      This video call has been cancelled
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        ) : (
          <Card className="w-full max-w-lg shadow-sm border border-emerald-100/50 bg-white/80 backdrop-blur">
            <CardHeader className="text-center space-y-3 pb-6">
              <div className="mx-auto h-14 w-14 rounded-full bg-gradient-to-br from-emerald-100 to-green-100 flex items-center justify-center">
                <Clock className="h-7 w-7 text-emerald-600" />
              </div>
              <div>
                <CardTitle className="text-2xl text-gray-900">
                  Awaiting Student
                </CardTitle>
                <CardDescription className="text-gray-600 mt-2">
                  The student hasn't selected a meeting time yet
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-semibold text-blue-900 mb-1">
                      No Schedule Request Yet
                    </h3>
                    <p className="text-sm text-gray-700">
                      Once the student proposes a meeting time, you'll be able
                      to review and respond here.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      ) : (
        <Card className="w-full max-w-md shadow-sm border border-gray-200 bg-white/80 backdrop-blur">
          <CardContent className="p-8 text-center space-y-4">
            <div className="mx-auto h-14 w-14 rounded-full bg-red-100 flex items-center justify-center">
              <XCircle className="h-7 w-7 text-red-600" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-gray-900">
                Invalid Role
              </h2>
              <p className="text-sm text-gray-600">
                Please select a valid role to continue
              </p>
            </div>
            <Link href="/select-role">
              <Button
                variant="outline"
                className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
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
