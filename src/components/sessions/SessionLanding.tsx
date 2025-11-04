"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import SessionForm from "@/components/sessions/Form";
import {
  MeetingSessionSelectType,
  StudentProfileSelectType,
  UserSelectType,
} from "../../../lib/db/schema";
import Link from "next/link";
import { ArrowRight, Sparkles, Users, Video, CheckCircle2 } from "lucide-react";

const MotionLink = motion(Link);

export default function SessionLandingPage({
  studentProfileRecord,
  sessionRecord,
  hasSession,
  role,
}: {
  studentProfileRecord?: StudentProfileSelectType & { user: UserSelectType };
  sessionRecord?: MeetingSessionSelectType | null;
  hasSession: boolean;
  role?: "student" | "mentor" | "admin";
  hasStudentOnboardingData?: boolean;
}) {
  const scrollToForm = () => {
    const el = document.getElementById("bookingForm");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      {/* Hero Section */}
      <div className="relative min-h-screen w-full bg-gradient-to-b from-white via-green-50/30 to-white flex flex-col items-center justify-center px-6 py-20">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

        <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-full">
              <Sparkles className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-700">
                Live mentorship sessions
              </span>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            className="text-5xl sm:text-6xl md:text-7xl font-bold text-gray-900 text-center mb-6 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Learn from experts.
            <br />
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Grow faster.
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            className="max-w-2xl text-center text-lg sm:text-xl text-gray-600 mb-12 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Join group mentorship sessions with verified professionals. Get
            personalized guidance, ask questions, and accelerate your learning
            journey—completely free.
          </motion.p>

          {/* Feature Pills */}
          <motion.div
            className="flex flex-wrap items-center justify-center gap-4 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full shadow-sm">
              <Video className="w-4 h-4 text-green-600" />
              <span className="text-sm text-gray-700">Live sessions</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full shadow-sm">
              <Users className="w-4 h-4 text-green-600" />
              <span className="text-sm text-gray-700">Small groups</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span className="text-sm text-gray-700">100% free</span>
            </div>
          </motion.div>

          {/* CTA Card */}
          <motion.div
            className="w-full max-w-xl bg-white border border-gray-200 rounded-2xl shadow-lg p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <Video className="w-6 h-6 text-green-600" />
              </div>

              <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                {hasSession && role === "student" ? (
                  "Spot reserved"
                ):(
                  "Reserve your spot"
  )}
              </h2>

              <p className="text-gray-600 mb-6 leading-relaxed">
                Join our next mentorship session. Connect 1:1 with experienced
                mentors, get personalized advice, and take your skills to the
                next level.
              </p>

              {/* Conditional CTAs */}
              {!hasSession ? (
                <MotionLink
                  href="/login"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
                >
                  Sign in to continue
                  <ArrowRight className="w-4 h-4" />
                </MotionLink>
              ) : role === "student" ? (
                sessionRecord ? (
                  <div className="w-full p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 text-green-700 mb-2">
                      <CheckCircle2 className="w-5 h-5" />
                      <span className="font-medium">
                        You&apos;re registered!
                      </span>
                    </div>
                    <p className="text-sm text-green-600">
                      Check your email for the meeting link within 24 hours.
                    </p>
                  </div>
                ) : (
                  <Button
                    onClick={scrollToForm}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg"
                  >
                    Book your session
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                )
              ) : (
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <p className="text-sm text-gray-600">
                    Mentorship sessions are exclusively for students
                  </p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Scroll indicator for students who can book */}
          {hasSession && role === "student" && !sessionRecord && (
            <motion.button
              onClick={scrollToForm}
              className="mt-12 flex flex-col items-center gap-2 text-gray-500 hover:text-green-600 transition-colors"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <span className="text-sm font-medium">
                Complete registration below
              </span>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight className="w-5 h-5 rotate-90" />
              </motion.div>
            </motion.button>
          )}
        </div>
      </div>

      {/* Form Section */}
      {role === "student" && !sessionRecord && (
        <div  className="scroll-mt-8">
          <SessionForm
            studentProfileRecord={studentProfileRecord ?? null}
            sessionRecord={sessionRecord ?? null}
          />
        </div>
      )}
    </>
  );
}
