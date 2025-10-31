"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  MeetingSessionSelectType,
  StudentProfileSelectType,
  UserSelectType,
} from "../../../lib/db/schema";
import { capitalizeFirstLetter } from "better-auth";
import Image from "next/image";
import SessionCountdown from "./SessionCountDown";
import {
  joinSession,
  SessionFormState,
} from "../../../server/actions/session/join-session";
import { useActionState, useEffect, useState } from "react";
import { Spinner } from "../ui/spinner";
import { toast } from "sonner";
import { FieldError } from "../ui/field";
import { authClient } from "../../../server/lib/auth/auth-client";
import { useRouter } from "next/navigation";
import {
  IconBrandFacebook,
  IconBrandTiktok,
  IconBrandYoutube,
} from "@tabler/icons-react";
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  MessageSquare,
} from "lucide-react";

export default function SessionForm({
  studentProfileRecord,
  sessionRecord,
}: {
  studentProfileRecord:
    | (StudentProfileSelectType & { user: UserSelectType })
    | null;
  sessionRecord: MeetingSessionSelectType | null;
}) {
  const router = useRouter();
  const initialState: SessionFormState = {
    message: "",
    success: false,
    timestamp: 124,
  };
  const [state, formAction, isPending] = useActionState<
    SessionFormState,
    FormData
  >(joinSession, initialState);

  useEffect(() => {
    if (state.success && state.message) {
      toast.success(state.message, { position: "top-right" });
      setTimeout(() => {
        router.refresh();
      }, 1050);
    }
    if (!state.success && state.message) {
      toast.error(state.message, { position: "top-right" });
    }
  }, [state.success, state.message, state.timestamp, router]);

  const { data: session } = authClient.useSession();
  const [city, setCity] = useState<string | null>(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            );
            const data = await response.json();
            setCity(data.city);
          } catch (error) {
            console.error("Error fetching city:", error);
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
        }
      );
    }
  }, []);

  if (sessionRecord) {
    return (
      <section className="relative py-24 px-6 bg-gradient-to-b from-white to-green-50/30">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-green-200 rounded-2xl p-8 shadow-lg"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>

              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Registration confirmed
              </h2>

              <p className="text-gray-600 mb-6">
                Thank you, <strong>{studentProfileRecord?.user.name}</strong>!
                You&apos;re all set for the session.
              </p>

              <div className="w-full p-4 bg-gray-50 rounded-lg mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                  <span className="font-medium">Confirmation sent to:</span>
                </div>
                <p className="text-gray-900 font-medium">
                  {studentProfileRecord?.user.email}
                </p>
              </div>

              <div className="p-4 bg-green-50 border border-green-200 rounded-lg w-full">
                <p className="text-sm text-green-800 leading-relaxed">
                  <strong>What&apos;s next?</strong> You&apos;ll receive the
                  meeting link via email within 24 hours before the session
                  starts. Make sure to check your inbox!
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-24 px-6 bg-gradient-to-b from-white to-green-50/30">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left: Session Details */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Session Info Card */}
            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                Session details
              </h3>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">
                      November 06, 2025
                    </p>
                    <p className="text-sm text-gray-500">Mark your calendar</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">45 minutes</p>
                    <p className="text-sm text-gray-500">
                      Live interactive session
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Online via Google Meet</p>
                    <p className="text-sm text-gray-500">
                      Link will be sent to your email
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-green-800 leading-relaxed">
                  Join this live session to explore study abroad pathways and
                  get personalized guidance. Ask questions and learn from those
                  who&apos;ve walked the path.
                </p>
              </div>
            </div>

            {/* Mentors */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">
                Your mentors
              </h3>

              <div className="grid sm:grid-cols-2 gap-4">
                {/* Mentor 1 */}
                <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                  <div className="flex flex-col items-center text-center">
                    <Image
                      src="https://yt3.googleusercontent.com/AgHRTctkokHk0TyCz9-g2Eczv6HL949n050Id0muKqmTDqTILN15ttI9WPqHLgw-vJHmhKdsADo=s160-c-k-c0x00ffffff-no-rj"
                      width={72}
                      height={72}
                      alt="Bigyan Lama"
                      className="rounded-full mb-3 border-2 border-gray-100"
                    />
                    <h4 className="font-semibold text-gray-900 mb-1">
                      Bigyan Lama
                    </h4>
                    <p className="text-sm text-gray-500 mb-3">
                      Education Consultant • Japan
                    </p>

                    <div className="flex items-center gap-3">
                      <a
                        href="https://youtube.com/@bigyan_lama?si=2vrs-gyvAg-JfN2I"
                        className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-red-600 transition-colors"
                      >
                        <IconBrandYoutube className="w-4 h-4" />
                        <span>13K</span>
                      </a>
                      <a
                        href="https://www.tiktok.com/@bigyan.lama95?_t=ZS-90hYx4JTXKZ&_r=1"
                        className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-pink-600 transition-colors"
                      >
                        <IconBrandTiktok className="w-4 h-4" />
                        <span>22K</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Mentor 2 */}
                <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                  <div className="flex flex-col items-center text-center">
                    <Image
                      src="/mentorImage/rakeshDai.jpeg"
                      width={72}
                      height={72}
                      alt="Rakesh Dai"
                      className="rounded-full mb-3 border-2 border-gray-100"
                    />
                    <h4 className="font-semibold text-gray-900 mb-1">
                      Rakesh Dai
                    </h4>
                    <p className="text-sm text-gray-500 mb-3">
                      Social Media Mentor
                    </p>

                    <div className="flex items-center gap-3">
                      <a
                        href="https://facebook.com"
                        className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-blue-600 transition-colors"
                      >
                        <IconBrandFacebook className="w-4 h-4" />
                        <span>6K</span>
                      </a>
                      <a
                        href="https://www.tiktok.com"
                        className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-pink-600 transition-colors"
                      >
                        <IconBrandTiktok className="w-4 h-4" />
                        <span>24K</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Countdown */}
            <SessionCountdown targetDate="2025-11-06T15:00:00+05:45" />
          </motion.div>

          {/* Right: Registration Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm sticky top-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                Complete your registration
              </h3>

              <form action={formAction} className="space-y-6">
                {/* Name */}
                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    className="text-sm font-medium text-gray-700"
                  >
                    Full name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Enter your full name"
                    defaultValue={
                      state.inputs?.name ||
                      studentProfileRecord?.user.name ||
                      session?.user.name
                    }
                    className="h-11"
                    required
                  />
                  {state.errors?.name && (
                    <FieldError>{state.errors.name[0]}</FieldError>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-700"
                  >
                    Email address
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your.email@example.com"
                    defaultValue={
                      state.inputs?.email ||
                      studentProfileRecord?.user.email ||
                      session?.user.email
                    }
                    className="h-11"
                    required
                  />
                  {state.errors?.email && (
                    <FieldError>{state.errors.email[0]}</FieldError>
                  )}
                </div>

                {/* City */}
                <div className="space-y-2">
                  <Label
                    htmlFor="city"
                    className="text-sm font-medium text-gray-700"
                  >
                    City
                  </Label>
                  <Input
                    id="city"
                    name="city"
                    placeholder="Your city"
                    defaultValue={
                      state.inputs?.city ||
                      capitalizeFirstLetter(studentProfileRecord?.city ?? "") ||
                      city ||
                      ""
                    }
                    className="h-11"
                    required
                  />
                  {state.errors?.city && (
                    <FieldError>{state.errors.city[0]}</FieldError>
                  )}
                </div>

                {/* Question */}
                <div className="space-y-2">
                  <Label
                    htmlFor="question"
                    className="text-sm font-medium text-gray-700"
                  >
                    Questions for mentors{" "}
                    <span className="text-gray-400">(optional)</span>
                  </Label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <textarea
                      id="question"
                      name="question"
                      placeholder="What would you like to know?"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      rows={4}
                      defaultValue={state.inputs?.question}
                    />
                  </div>
                  {state.errors?.question && (
                    <FieldError>{state.errors.question[0]}</FieldError>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 bg-green-600 hover:bg-green-700 text-white font-medium"
                  disabled={isPending}
                >
                  {isPending ? <Spinner /> : "Reserve my spot"}
                </Button>

                <input
                  type="hidden"
                  name="userId"
                  value={studentProfileRecord?.userId || session?.user.id || ""}
                />

                <p className="text-xs text-gray-500 text-center leading-relaxed">
                  By registering, you&apos;ll receive the meeting link via
                  email. No payment required—sessions are completely free.
                </p>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
