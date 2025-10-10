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
import { Card, CardContent } from "./ui/card";

export default function ScheduleCall({
  videoId,
  onSuccess,
  role,
}: {
  videoId: string;
  onSuccess?: (bool: boolean) => void;
  role: "student" | "mentor";
}) {
  console.log("Role from schedule call component: ", role);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState<string>("10:30:00");
  const [videoRecord, setVideoRecord] =
    useState<VideoCallWithStudentAndMentor | null>(null);
  const [trigger, setTrigger] = useState<boolean>(false);
  const [redirectTo, setRedirectTo] = useState<string>("");
  const [pending, setPending] = useState<boolean>(false);

  const router = useRouter();

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
  const [isRejected, setIsRejected] = useState<boolean>(false);
  const pathname = usePathname();
  const isVideoCallRoute = pathname.startsWith("/video-call");
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
  }, [videoId]);
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
        className="flex items-center justify-center min-h-screen bg-gradient-to-br from-emerald-50 to-green-50"
      >
        <Loader />
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

    console.log("Everything's good.");
    const result = await sendVideoCallSchedule(
      videoId,
      String(date),
      role,
      time,
      studentId,
      mentorId
    );

    if (result?.success && result.message) {
      toast.success(result.message);
      setTrigger(true);
      setRedirectTo(result.redirectTo as string);
    } else if (!result?.success && result?.message) {
      toast.error(result.message);
      setPending(false);
    }
    setPending(false);
  };
  if (trigger) {
    setTimeout(() => {
      router.push(redirectTo);
      setPending(false);
    }, 1500);
  }
  return (
    <div
      className={`flex items-center justify-center ${isVideoCallRoute && "min-h-screen bg-gradient-to-br from-emerald-50 to-green-50"}   w-full flex-col gap-7 py-8 px-4`}
    >
      {isVideoCallRoute && (
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                href="/dashboard/student"
                className="text-emerald-700 hover:text-emerald-900"
              >
                Dashboard
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink
                href="/video-call"
                className="text-emerald-700 hover:text-emerald-900"
              >
                Video call
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-gray-900 font-medium">
                {role === "mentor" ? "Respond" : "Schedule"}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      )}

      {role === "student" ? (
        videoRecord?.preferredTime &&
        videoRecord.preferredTime.studentPreferredTime ? (
          <Card className="w-full max-w-2xl shadow-lg border-emerald-100">
            <CardContent className="p-8 space-y-6">
              <div className="flex flex-col space-y-2">
                <h1 className="text-sm font-medium text-emerald-700">
                  Your selected Date and Time
                </h1>
                <p className="text-gray-900 font-medium">
                  {videoRecord.preferredTime.studentPreferredTime.toLocaleString()}
                </p>
              </div>
              {videoRecord.preferredTime.mentorPreferredTime ? (
                videoRecord.preferredTime.mentorPreferredTime !==
                videoRecord.preferredTime.studentPreferredTime ? (
                  <div className="flex flex-col gap-5">
                    <div className="flex flex-col gap-4 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                      <div>
                        <h2 className="text-base font-semibold text-gray-900 mb-2">
                          Mentor Preferred Date and Time
                        </h2>
                        <p className="text-gray-700">
                          {videoRecord.preferredTime.mentorPreferredTime.toLocaleString()}
                        </p>
                      </div>
                      <p className="text-sm text-gray-600">
                        If you are not available at this Date and Time then
                        please click the reject button and send a new Date and
                        Time to the Mentor
                      </p>
                      <div className="flex gap-3">
                        <Button
                          className="bg-emerald-600 hover:bg-emerald-700 text-white transition-all duration-300"
                          disabled={isRejected || pending}
                          onClick={handleAccept}
                        >
                          {pending ? <Loader from="schedule" /> : "Accept"}
                        </Button>
                        <Button
                          variant="outline"
                          className="border-gray-300 hover:bg-gray-100 transition-all duration-300 bg-transparent"
                          onClick={() => setIsRejected(true)}
                          disabled={isRejected || pending}
                        >
                          Reject
                        </Button>
                      </div>
                    </div>
                    {isRejected && !state.success && (
                      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <Card className="w-full max-w-md shadow-2xl">
                          <CardContent className="p-8 space-y-6">
                            <h2 className="text-xl font-semibold text-gray-900">
                              Select a new Date and Time
                            </h2>
                            <form
                              action={formAction}
                              className="flex flex-col gap-5"
                            >
                              <DateTimePicker
                                onDateChange={setDate}
                                onTimeChange={setTime}
                                date={date}
                                time={time}
                              />
                              {state.errors?.date && (
                                <p className="text-xs text-red-500">
                                  {state.errors.date[0]}
                                </p>
                              )}
                              {state.errors?.time && (
                                <p className="text-xs text-red-500">
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

                              <div className="flex gap-3">
                                <Button
                                  className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                                  type="submit"
                                  disabled={!date || isPending || !videoId}
                                >
                                  {isPending ? (
                                    <Loader borderColor="green" />
                                  ) : (
                                    "Confirm"
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
                  <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                    <p className="text-gray-900">
                      The mentor has agreed for a video call at the Date and
                      Time you selected, please check your mail for the video
                      call link
                    </p>
                  </div>
                )
              ) : (
                <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <p className="text-gray-900">
                    The mentor is yet to evaluate the Date and Time you
                    selected.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card className="w-full max-w-md shadow-lg border-emerald-100">
            <CardContent className="p-8 space-y-6">
              <div className="flex flex-col items-center gap-4">
                <p className="text-sm text-gray-600 text-center">
                  Pick a Date and Time to schedule your video call with
                </p>
                <div className="flex items-center gap-3">
                  {videoRecord?.mentorProfile.imageUrl ? (
                    <Image
                      src={
                        videoRecord?.mentorProfile.imageUrl ||
                        "https://vbteadl6m3.ufs.sh/f/DDJ5nPL6Yp1sHfAviE2zasoidYb10Mu7JGNQFZWgVmCrRHPE" ||
                        "/placeholder.svg"
                      }
                      alt="mentor photo"
                      height={50}
                      width={50}
                      className="object-cover rounded-full h-12 w-12 ring-2 ring-emerald-200"
                    />
                  ) : (
                    <Loader borderColor="indigo" />
                  )}
                  <span className="font-semibold text-lg capitalize text-gray-900">
                    {videoRecord?.mentorProfile.user?.name || ""}
                  </span>
                </div>
              </div>
              <form action={formAction} className="flex flex-col gap-5">
                <DateTimePicker
                  onDateChange={setDate}
                  onTimeChange={setTime}
                  date={date}
                  time={time}
                />
                {state.errors?.date && (
                  <p className="text-xs text-red-500">{state.errors.date[0]}</p>
                )}
                {state.errors?.time && (
                  <p className="text-xs text-red-500">{state.errors.time[0]}</p>
                )}
                <input type="hidden" name="date" value={String(date)} />
                <input type="hidden" name="time" value={time} />
                <input type="hidden" name="videoId" value={videoId} />
                <input type="hidden" name="role" value={role} />

                <Button
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                  type="submit"
                  disabled={!date || isPending || !videoId}
                >
                  {isPending ? <Loader /> : "Submit"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )
      ) : role === "mentor" ? (
        videoRecord?.preferredTime &&
        videoRecord.preferredTime.studentPreferredTime ? (
          <Card className="w-full max-w-2xl shadow-lg border-emerald-100">
            <CardContent className="p-8 space-y-6">
              <div className="flex flex-col space-y-2">
                <h1 className="text-sm font-medium text-emerald-700">
                  Student selected Date and Time
                </h1>
                <p className="text-gray-900 font-medium">
                  {videoRecord.preferredTime.studentPreferredTime.toLocaleString()}
                </p>
              </div>
              {videoRecord.preferredTime.studentPreferredTime ? (
                videoRecord.preferredTime.studentPreferredTime !==
                videoRecord.preferredTime.mentorPreferredTime ? (
                  <div className="flex flex-col gap-5">
                    <div className="flex flex-col gap-4 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                      <p className="text-sm text-gray-600">
                        If you are not available at this Date and Time then
                        please click the reject button and send a new Date and
                        Time to the Student
                      </p>
                      <div className="flex gap-3">
                        <Button
                          className="bg-emerald-600 hover:bg-emerald-700 text-white transition-all duration-300"
                          disabled={isRejected || pending}
                          onClick={handleAccept}
                        >
                          {pending ? <Loader from="respond" /> : "Accept"}
                        </Button>
                        <Button
                          variant="outline"
                          className="border-gray-300 hover:bg-gray-100 transition-all duration-300 bg-transparent"
                          onClick={() => setIsRejected(true)}
                          disabled={isRejected || pending}
                        >
                          Reject
                        </Button>
                      </div>
                    </div>
                    {isRejected && !state.success && (
                      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <Card className="w-full max-w-md shadow-2xl">
                          <CardContent className="p-8 space-y-6">
                            <h2 className="text-xl font-semibold text-gray-900">
                              Select a new Date and Time
                            </h2>
                            <form
                              action={formAction}
                              className="flex flex-col gap-5"
                            >
                              <DateTimePicker
                                onDateChange={setDate}
                                onTimeChange={setTime}
                                date={date}
                                time={time}
                              />
                              {state.errors?.date && (
                                <p className="text-xs text-red-500">
                                  {state.errors.date[0]}
                                </p>
                              )}
                              {state.errors?.time && (
                                <p className="text-xs text-red-500">
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

                              <div className="flex gap-3">
                                <Button
                                  className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                                  type="submit"
                                  disabled={!date || isPending || !videoId}
                                >
                                  {isPending ? (
                                    <Loader borderColor="green" />
                                  ) : (
                                    "Confirm"
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
                  <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                    <p className="text-gray-900">
                      The student has agreed for a video call at the Date and
                      Time you selected, please check your mail for the video
                      call link
                    </p>
                  </div>
                )
              ) : (
                <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <p className="text-gray-900">
                    The student is yet to agree upon the Date and Time you
                    selected.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card className="w-full max-w-md shadow-lg border-emerald-100">
            <CardContent className="p-8 space-y-6">
              <div className="flex flex-col items-center gap-5">
                {videoRecord.preferredTime.studentPreferredTime && (
                  <div className="w-full p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                    <h2 className="text-base font-semibold text-gray-900 mb-2">
                      Student Preferred Date and Time
                    </h2>
                    <p className="text-gray-700">
                      {videoRecord.preferredTime.studentPreferredTime.toLocaleString()}
                    </p>
                  </div>
                )}
                <div className="flex flex-col gap-3 items-center">
                  <p className="text-sm text-gray-600 text-center">
                    Pick a Date and Time to schedule your video call with
                  </p>
                  <div className="flex items-center gap-3">
                    {videoRecord?.studentProfile.imageUrl ? (
                      <Image
                        src={
                          videoRecord?.studentProfile.imageUrl ||
                          "https://vbteadl6m3.ufs.sh/f/DDJ5nPL6Yp1sHfAviE2zasoidYb10Mu7JGNQFZWgVmCrRHPE" ||
                          "/placeholder.svg"
                        }
                        alt="student photo"
                        height={50}
                        width={50}
                        className="object-cover rounded-full h-12 w-12 ring-2 ring-emerald-200"
                      />
                    ) : (
                      <Loader borderColor="indigo" />
                    )}
                    <span className="font-semibold text-lg capitalize text-gray-900">
                      {videoRecord?.studentProfile?.user?.name || ""}
                    </span>
                  </div>
                </div>
              </div>
              <form action={formAction} className="flex flex-col gap-5">
                <DateTimePicker
                  onDateChange={setDate}
                  onTimeChange={setTime}
                  date={date}
                  time={time}
                />
                {state.errors?.date && (
                  <p className="text-xs text-red-500">{state.errors.date[0]}</p>
                )}
                {state.errors?.time && (
                  <p className="text-xs text-red-500">{state.errors.time[0]}</p>
                )}
                <input type="hidden" name="date" value={String(date)} />
                <input type="hidden" name="time" value={time} />
                <input type="hidden" name="videoId" value={videoId} />
                <input type="hidden" name="role" value={role} />

                <Button
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                  type="submit"
                  disabled={!date || isPending || !videoId}
                >
                  {isPending ? <Loader /> : "Submit"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )
      ) : (
        <Card className="w-full max-w-md shadow-lg">
          <CardContent className="p-8 text-center space-y-4">
            <h1 className="text-lg font-semibold text-gray-900">
              Invalid role
            </h1>
            <Link href="/select-role">
              <Button
                variant="outline"
                className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 bg-transparent"
              >
                Select role
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
