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
import { useActionState, useEffect } from "react";
import { Spinner } from "../ui/spinner";
import { toast } from "sonner";
import { FieldError } from "../ui/field";

export default function SessionForm({
  studentProfileRecord,
  sessionRecord,
}: {
  studentProfileRecord: StudentProfileSelectType & { user: UserSelectType };
  sessionRecord: MeetingSessionSelectType | null;
}) {
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
    }
    if (!state.success && state.message) {
      toast.error(state.message, { position: "top-right" });
    }
  }, [state.success, state.message, state.timestamp]);
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
          {/* Mentor Info */}
          <div className="flex flex-col items-center">
            <Image
              src="https://yt3.googleusercontent.com/AgHRTctkokHk0TyCz9-g2Eczv6HL949n050Id0muKqmTDqTILN15ttI9WPqHLgw-vJHmhKdsADo=s160-c-k-c0x00ffffff-no-rj"
              width={80}
              height={80}
              alt="Mentor"
              className="rounded-full shadow-md mb-3"
            />
            <h2 className="text-2xl font-semibold text-gray-900">
              Bigyan Lama
            </h2>
            <p className="text-gray-500 text-sm mb-2">
              Japan | Education Consultant
            </p>

            {/* Social Icons */}
            <div className="flex gap-4 mt-2">
              <a
                href="https://youtube.com/@bigyan_lama?si=2vrs-gyvAg-JfN2I"
                className="text-red-500 hover:text-red-600 transition-transform hover:scale-110"
                aria-label="YouTube"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  className="w-6 h-6"
                >
                  <path d="M19.615 3.184a3.001 3.001 0 0 1 2.12 2.121C22 6.78 22 12 22 12s0 5.22-.265 6.695a3.001 3.001 0 0 1-2.12 2.121C18.12 21 12 21 12 21s-6.12 0-7.615-.184a3.001 3.001 0 0 1-2.12-2.121C2 17.22 2 12 2 12s0-5.22.265-6.695a3.001 3.001 0 0 1 2.12-2.121C5.88 3 12 3 12 3s6.12 0 7.615.184zM10 15.5l6-3.5-6-3.5v7z" />
                </svg>
              </a>
              <a
                href="https://www.tiktok.com/@bigyan.lama95?_t=ZS-90hYx4JTXKZ&_r=1"
                className="text-pink-500 hover:text-pink-600 transition-transform hover:scale-110"
                aria-label="TikTok"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  className="w-6 h-6"
                >
                  <path d="M12.2 2h3.1a4.8 4.8 0 0 0 4.8 4.8V9a7.3 7.3 0 0 1-4.8-1.7v6.3A5.4 5.4 0 1 1 9.9 8v2.8a2.6 2.6 0 1 0 1.8 2.5V2z" />
                </svg>
              </a>
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
                Thank you <strong>{studentProfileRecord.user.name}</strong> for
                joining!
              </p>
              <p className="text-gray-700 text-center mb-4">
                Your registration email:{" "}
                <strong>{studentProfileRecord.user.email}</strong>
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
                  state.inputs?.name || studentProfileRecord.user.name
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
                  state.inputs?.email || studentProfileRecord.user.email
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
                  capitalizeFirstLetter(studentProfileRecord.city ?? "")
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
              value={studentProfileRecord.userId}
            />
          </motion.form>
        )}
      </div>
    </section>
  );
}
