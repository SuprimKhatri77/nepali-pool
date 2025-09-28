"use client";
import { useActionState, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { DateTimePicker } from "./ui/date-time-picker";
import {
  FormState,
  scheduleVideoCallTime,
} from "../../server/actions/schedule-video-call/scheduleCall";

import { toast } from "sonner";
import { getVideoCallWithMentorProfile } from "../../server/helper/getVideoCallWithMentorProfile";
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
import { VideoCallWithStudentAndMentor } from "../../types/all-types";

export default function ScheduleCall({
  videoId,
  onSuccess,
  role,
}: {
  videoId: string;
  onSuccess?: (bool: boolean) => void;
  role?: string;
}) {
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
      const data = await getVideoCallWithMentorProfile(videoId);
      if (!data) return;
      console.log("Data: ", data);

      setVideoRecord(data);
      // console.log("VideoRecord: ", videoRecord);
    };
    fetchData();
  }, [videoId]);
  useEffect(() => {
    if (state.success && state.message) {
      onSuccess?.(true);
      setIsRejected(false);
      toast.success(state.message);
    }
    if (!state.success && state.message) {
      toast.error(state.message);
    }
  }, [state.success, state.message, state.timestamp]);
  if (!videoRecord) {
    return (
      <div className="flex items-center justify-center min-h-screen">
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
      className={`flex items-center justify-center ${isVideoCallRoute && "min-h-screen"}   w-full flex-col gap-7 `}
    >
      {isVideoCallRoute && (
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard/student">
                Dashboard
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/video-call">Video call</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Respond</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      )}
      {role === "student" ? (
        videoRecord?.preferredTime &&
        videoRecord.preferredTime.studentPreferredTime ? (
          <div>
            <div className="flex flex-col">
              <h1 className="text-muted-foreground text-xs flex">
                Your selected Date and Time
              </h1>
              <div>
                <p>
                  Date:{" "}
                  {videoRecord.preferredTime.studentPreferredTime.toLocaleString()}
                </p>
              </div>
            </div>
            {videoRecord.preferredTime.mentorPreferredTime ? (
              videoRecord.preferredTime.mentorPreferredTime !==
              videoRecord.preferredTime.studentPreferredTime ? (
                <div className="flex flex-col gap-5">
                  <div className="flex flex-col gap-3">
                    <div>
                      <h1>Mentor Preferred Date and Time</h1>
                      <div>
                        Date and Time:{" "}
                        {videoRecord.preferredTime.mentorPreferredTime.toLocaleString()}
                      </div>
                    </div>
                    <p>
                      If you are not availabe at this Date and Time then please
                      click the reject button and send a new Date and Time to
                      the Mentor
                    </p>
                    <div className="flex gap-5">
                      <Button
                        className="bg-blue-500 hover:bg-blue-600 transition-all duration-300 cursor-pointer"
                        disabled={isRejected || pending}
                        onClick={handleAccept}
                      >
                        {pending ? <Loader from="schedule" /> : "Accept"}
                      </Button>
                      <Button
                        className="bg-red-500 hover:bg-red-600 transition-all duration-300 cursor-pointer"
                        onClick={() => setIsRejected(true)}
                        disabled={isRejected || pending}
                      >
                        Reject
                      </Button>
                    </div>
                    <div
                      className={`${isRejected && !state.success ? "flex" : "hidden"} absolute left-100 bottom-50 bg-slate-100 z-50 py-10 px-8 rounded-xl shadow-2xl   flex-col gap-5 `}
                    >
                      <h1 className="text-lg font-medium">
                        Select a new Date and Time
                      </h1>
                      <form
                        action={formAction}
                        className="flex flex-col gap-5 items-center justify-center"
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
                        <input type="hidden" name="date" value={String(date)} />
                        <input type="hidden" name="time" value={time} />
                        <input type="hidden" name="videoId" value={videoId} />
                        <input type="hidden" name="role" value={role} />

                        <Button
                          className=""
                          type="submit"
                          disabled={!date || isPending || !videoId}
                        >
                          {isPending ? (
                            <Loader borderColor="green" />
                          ) : (
                            "Confirm"
                          )}
                        </Button>
                      </form>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <h1>
                    The mentor has agreed for a video call at the Date and Time
                    you selected, please check your mail for the video call link
                  </h1>
                </div>
              )
            ) : (
              <div>
                <h1>
                  The mentor is yet to evaluate the Date and Time you selected.
                </h1>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center">
              <h1 className="text-muted-foreground text-xs flex">
                Pick a Date and Time to schedule your video call with,
              </h1>
              <br />
              <div className="flex items-center gap-2">
                {videoRecord?.mentorProfile.imageUrl ? (
                  <Image
                    src={
                      videoRecord?.mentorProfile.imageUrl ||
                      "https://vbteadl6m3.ufs.sh/f/DDJ5nPL6Yp1sHfAviE2zasoidYb10Mu7JGNQFZWgVmCrRHPE"
                    }
                    alt="mentor photo"
                    height={50}
                    width={100}
                    className="object-cover obeject-center rounded-full h-8 w-8"
                  />
                ) : (
                  <Loader borderColor="indigo" />
                )}
                <span className="text-center -order-1 w-full font-medium capitalize text-gray-600">
                  {videoRecord?.mentorProfile.user?.name || ""}
                </span>
              </div>
            </div>
            <form
              action={formAction}
              className="flex flex-col gap-5 items-center justify-center"
            >
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
                className=""
                type="submit"
                disabled={!date || isPending || !videoId}
              >
                Submit
              </Button>
            </form>
          </>
        )
      ) : role === "mentor" ? (
        videoRecord?.preferredTime &&
        videoRecord.preferredTime.studentPreferredTime ? (
          <div>
            <div className="flex flex-col">
              <h1 className="text-muted-foreground text-xs flex">
                Student selected Date and Time
              </h1>
              <div>
                <p>
                  Date:{" "}
                  {videoRecord.preferredTime.studentPreferredTime.toLocaleString()}
                </p>
              </div>
            </div>
            {videoRecord.preferredTime.studentPreferredTime ? (
              videoRecord.preferredTime.studentPreferredTime !==
              videoRecord.preferredTime.mentorPreferredTime ? (
                <div className="flex flex-col gap-5">
                  <div className="flex flex-col gap-3">
                    <p>
                      If you are not availabe at this Date and Time then please
                      click the reject button and send a new Date and Time to
                      the Student
                    </p>
                    <div className="flex gap-5">
                      <Button
                        className="bg-blue-500 hover:bg-blue-600 transition-all duration-300 cursor-pointer"
                        disabled={isRejected || pending}
                        onClick={handleAccept}
                      >
                        {pending ? <Loader from="respond" /> : "Accept"}
                      </Button>
                      <Button
                        className="bg-red-500 hover:bg-red-600 transition-all duration-300 cursor-pointer"
                        onClick={() => setIsRejected(true)}
                        disabled={isRejected || pending}
                      >
                        Reject
                      </Button>
                    </div>
                    <div
                      className={`${isRejected && !state.success ? "flex" : "hidden"} absolute left-100 bottom-50 bg-slate-100 z-50 py-10 px-8 rounded-xl shadow-2xl   flex-col gap-5 `}
                    >
                      <h1 className="text-lg font-medium">
                        Select a new Date and Time
                      </h1>
                      <form
                        action={formAction}
                        className="flex flex-col gap-5 items-center justify-center"
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
                        <input type="hidden" name="date" value={String(date)} />
                        <input type="hidden" name="time" value={time} />
                        <input type="hidden" name="videoId" value={videoId} />
                        <input type="hidden" name="role" value={role} />

                        <Button
                          className=""
                          type="submit"
                          disabled={!date || isPending || !videoId}
                        >
                          {isPending ? (
                            <Loader borderColor="green" />
                          ) : (
                            "Confirm"
                          )}
                        </Button>
                      </form>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <h1>
                    The student has agreed for a video call at the Date and Time
                    you selected, please check your mail for the video call link
                  </h1>
                </div>
              )
            ) : (
              <div>
                <h1>
                  The student is yet to agree upon the Date and Time you
                  selected.
                </h1>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center gap-5">
              {videoRecord.preferredTime.studentPreferredTime && (
                <div className="bg-slate-50 shadow-xl py-4 px-7 rounded-lg">
                  <h1>Student Preferred Date and Time</h1>
                  <div>
                    Date and Time:{" "}
                    {videoRecord.preferredTime.studentPreferredTime.toLocaleString()}
                  </div>
                </div>
              )}
              <div className="flex flex-col gap-2">
                <h1 className="text-muted-foreground text-xs">
                  Pick a Date and Time to schedule your video call with,
                </h1>
                <br />
                <div className="flex items-center gap-2">
                  {videoRecord?.studentProfile.imageUrl ? (
                    <Image
                      src={
                        videoRecord?.studentProfile.imageUrl ||
                        "https://vbteadl6m3.ufs.sh/f/DDJ5nPL6Yp1sHfAviE2zasoidYb10Mu7JGNQFZWgVmCrRHPE"
                      }
                      alt="mentor photo"
                      height={50}
                      width={100}
                      className="object-cover obeject-center rounded-full h-8 w-8"
                    />
                  ) : (
                    <Loader borderColor="indigo" />
                  )}
                  <span className="text-center -order-1 font-medium capitalize text-gray-600">
                    {videoRecord?.studentProfile?.user?.name || ""}
                  </span>
                </div>
              </div>
            </div>
            <form
              action={formAction}
              className="flex flex-col gap-5 items-center justify-center"
            >
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
                className=""
                type="submit"
                disabled={!date || isPending || !videoId}
              >
                Submit
              </Button>
            </form>
          </>
        )
      ) : (
        <div>
          <h1>Invalid role</h1>
          <Link href="/select-role">
            <Button variant="ghost">Select role</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
