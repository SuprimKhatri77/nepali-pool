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
import { IconBrandFacebook, IconBrandTiktok, IconBrandYoutube } from "@tabler/icons-react";

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
    timestamp: Date.now(),
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
  }, [state.success, state.message, state.timestamp]);
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
            console.log("City:", data.city);
            setCity(data.city);
          } catch (error) {
            console.error("Error fetching city:", error);
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
        }
      );
    } else {
      console.warn("Geolocation not supported by this browser.");
    }
  }, []);
  return (
    <section className="relative flex lg:flex-row flex-col py-16 px-2 sm:px-6 bg-emerald-200/60">
      {/* LEFT SECTION — SESSION DETAILS */}
      <div className="xl:w-1/2 flex flex-col items-center justify-start px-2 md:px-8 pt-8 relative">
        {/* Decorative Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-100 via-white to-blue-50 opacity-50 rounded-3xl blur-2xl -z-10" />

        {/* Session Detail Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="w-full max-w-lg mt-8 bg-white/70 backdrop-blur-md border border-gray-200 shadow-xl rounded-2xl p-6 text-center"
        >
{/* Mentor Info Section */}
<div className="flex flex-row flex-wrap justify-center gap-8 mt-6">

  {/* --- Mentor Card Component --- */}
  <div className="flex flex-col items-center bg-white/80 backdrop-blur-md border border-gray-200 shadow-lg rounded-2xl p-6 w-64 hover:scale-105 transition-transform">
    <Image
      src="https://yt3.googleusercontent.com/AgHRTctkokHk0TyCz9-g2Eczv6HL949n050Id0muKqmTDqTILN15ttI9WPqHLgw-vJHmhKdsADo=s160-c-k-c0x00ffffff-no-rj"
      width={80}
      height={80}
      alt="Bigyan Lama"
      className="rounded-full shadow-md mb-3"
    />
    <h2 className="text-2xl font-semibold text-gray-900">Bigyan Lama</h2>
    <p className="text-gray-500 text-sm mb-3 text-center">Japan | Education Consultant</p>

    {/* Social Icons */}
    <div className="flex gap-4">
      <a
        href="https://youtube.com/@bigyan_lama?si=2vrs-gyvAg-JfN2I"
        className="flex items-center gap-1 text-red-500 hover:text-red-600 transition-transform hover:scale-110"
        aria-label="YouTube"
      >
        <IconBrandYoutube className="w-5 h-5" /> <span className="text-sm font-medium">13K+</span>
      </a>
      <a
        href="https://www.tiktok.com/@bigyan.lama95?_t=ZS-90hYx4JTXKZ&_r=1"
        className="flex items-center gap-1 text-pink-500 hover:text-pink-600 transition-transform hover:scale-110"
        aria-label="TikTok"
      >
        <IconBrandTiktok className="w-5 h-5" /> <span className="text-sm font-medium">22K+</span>
      </a>
    </div>
  </div>

  {/* --- Mentor Card Component --- */}
  <div className="flex flex-col items-center bg-white/80 backdrop-blur-md border border-gray-200 shadow-lg rounded-2xl p-6 w-64 hover:scale-105 transition-transform">
    <Image
      src="/mentorImage/rakeshDai.jpeg"
      width={80}
      height={80}
      alt="Rakesh Dai"
      className="rounded-full shadow-md mb-3"
    />
    <h2 className="text-2xl font-semibold text-gray-900">Rakesh Dai</h2>
    <p className="text-gray-500 text-sm mb-3 text-center">Social Media Mentor</p>

    {/* Social Icons */}
    <div className="flex gap-4">
      <a
        href="https://facebook.com" // replace with real link
        className="flex items-center gap-1 text-blue-600 hover:text-blue-700 transition-transform hover:scale-110"
        aria-label="Facebook"
      >
        <IconBrandFacebook className="w-5 h-5" /> <span className="text-sm font-medium">6K+</span>
      </a>
      <a
        href="https://www.tiktok.com" // replace with real link
        className="flex items-center gap-1 text-pink-500 hover:text-pink-600 transition-transform hover:scale-110"
        aria-label="TikTok"
      >
        <IconBrandTiktok className="w-5 h-5" /> <span className="text-sm font-medium">24K+</span>
      </a>
    </div>
  </div>

</div>



          {/* Divider */}
          <div className="border-t border-gray-200 my-4"></div>

          {/* Session Info */}
          <div className="space-y-2 text-gray-700">
            <div className="flex justify-center gap-4 text-sm">
              <span className="flex items-center gap-1">
                📅 <strong>Oct 25, 2025</strong>
              </span>
              <span className="flex items-center gap-1">
                ⏰ <strong>45 mins</strong>
              </span>
            </div>

            <p className="mt-3 leading-relaxed">
              Join this live session to explore study abroad pathways with an
              experienced mentor currently studying in <strong>Japan</strong>.
              Get honest advice about the query of the students and student and
              life abroad.
            </p>
          </div>
        </motion.div>

        <motion.div
          className="mt-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          {/* time update for now manual */}
          <SessionCountdown targetDate="2025-11-06T15:00:00+05:45" />
        </motion.div>
      </div>

      {/* RIGHT SECTION — FORM */}
      <div className="flex-1">
        <motion.h2
          className="text-3xl sm:text-4xl font-bold text-center text-gray-900 my-6"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {sessionRecord ? "Joined" : "Join a session"}
        </motion.h2>
        {sessionRecord ? (
          <div className="h-full">
            <div className="max-w-md mx-auto my-auto bg-white shadow-lg rounded-2xl p-8 flex flex-col items-center justify-center">
              <h2 className="text-xl sm:text-2xl font-bold text-emerald-600 mb-4">
                ✅ Registration Submitted
              </h2>
              <p className="text-gray-700 text-center mb-2">
                Thank you{" "}
                <strong>{studentProfileRecord?.user.name || ""}</strong> for
                joining!
              </p>
              <p className="text-gray-700 text-center mb-4">
                Your registration email:{" "}
                <strong>{studentProfileRecord?.user.email || ""}</strong>
              </p>
              <p className="text-gray-700 text-center">
                The meeting link will be sent to your email within 24 hours.
              </p>
            </div>
          </div>
        ) : (
          <motion.form
            action={formAction}
            className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg flex flex-col gap-6"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Full Name */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="John Doe"
                defaultValue={
                  state.inputs?.name ||
                  studentProfileRecord?.user.name ||
                  session?.user.name
                }
                required
              />
              {state.errors?.name && (
                <FieldError>{state.errors.name[0]}</FieldError>
              )}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john@example.com"
                defaultValue={
                  state.inputs?.email ||
                  studentProfileRecord?.user.email ||
                  session?.user.email
                }
                required
              />
              {state.errors?.email && (
                <FieldError>{state.errors.email[0]}</FieldError>
              )}
            </div>

            {/* City */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                name="city"
                placeholder="Kathmandu"
                defaultValue={
                  state.inputs?.city ||
                  capitalizeFirstLetter(studentProfileRecord?.city ?? "") ||
                  city ||
                  ""
                }
                required
              />
              {state.errors?.city && (
                <FieldError>{state.errors.city[0]}</FieldError>
              )}
            </div>

            {/* Message */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="question">Message / Questions to Mentor</Label>
              <textarea
                id="question"
                name="question"
                placeholder="Any questions to mentor...? Ask Here!"
                className="border border-gray-300 rounded-lg p-3 resize-none"
                rows={4}
                defaultValue={state.inputs?.question}
              />
              {state.errors?.question && (
                <FieldError>{state.errors.question[0]}</FieldError>
              )}
            </div>

            <Button
              type="submit"
              className="bg-emerald-500 hover:bg-emerald-600 text-white"
              disabled={isPending}
            >
              {isPending ? <Spinner /> : "Join Session"}
            </Button>
            <input
              type="hidden"
              name="userId"
              value={studentProfileRecord?.userId || session?.user.id || ""}
            />
          </motion.form>
        )}
      </div>
    </section>
  );
}
