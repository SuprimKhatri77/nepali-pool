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
import { ArrowDownIcon, HomeIcon } from "lucide-react";
import { useRouter } from "next/navigation";
const MotionLink = motion(Link)
export default function SessionLandingPage({
  studentProfileRecord,
  sessionRecord,
  hasSession,
  role,
  hasStudentOnboardingData,
}: {
  studentProfileRecord?: StudentProfileSelectType & { user: UserSelectType };
  sessionRecord?: MeetingSessionSelectType | null;
  hasSession: boolean;
  role?: "student" | "mentor" | "admin";
  hasStudentOnboardingData?: boolean;
}) {
  const router = useRouter()

  return (
    <>
      <div className="relative min-h-screen w-full bg-emerald-200/80 flex flex-col items-center justify-center px-6 py-16">
        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 text-center mb-6"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          Connect with Professional Mentors
        </motion.h1>

        <motion.p
          className="max-w-3xl text-center text-lg sm:text-xl text-gray-700 mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Our platform helps students connect with verified mentors for group
          sessions. Currently, all sessions are private, weekly or bi-weekly.
          Students pay mentors directly, But for now each session are free, and
          we never charge any fees. Grow your skills with guidance from experts!
        </motion.p>

        <motion.div
          className="bg-white   border-2 border-emerald-700 rounded-2xl shadow-xl p-8 max-w-lg w-full flex flex-col items-center gap-6"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
            Mentorship Session
          </h2>
          <p className="text-gray-700  text-justify md:text-center text-balance">
            Join a personalized 1:1 session with a mentor. Sessions are designed
            to help you achieve your goals faster. Pay the mentor directly,
            access tips, and grow confidently.
          </p>

          {hasSession ? (
            hasStudentOnboardingData && role === "student" ? (
              <div className="flex gap-4 mt-4">
                <Button
                  onClick={() => {
                    const el = document.getElementById("bookingForm");
                    if (el) {
                      el.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white"
                >
                  Book a Session
                </Button>
                <Button variant="outline">Learn More</Button>
              </div>
            ) : !hasStudentOnboardingData && role === "student" ? (
              <div>
                <h1 className="text-lg font-semibold">
                  Please fill the{" "}
                  <Link
                    href="/onboarding/student"
                    className="underline hover:no-underline"
                  >
                    Student Onboarding
                  </Link>{" "}
                  form to register for the session.
                </h1>
              </div>
            ) : (
              role !== "student" && (
                <div>
                  <h1 className="text-lg font-semibold">
                    Sorry this is only for students
                  </h1>
                </div>
              )
            )
          ) : (
            <div>
              <h1 className="text-lg font-semibold">
                Please{" "}
                <MotionLink initial={{scale:1.1}} whileHover={{scale:0.9}} transition={{duration: 0.4, ease: "linear"}} href="/login" className=" px-4 py-1 rounded-[6px] bg-emerald-600 text-white">
                  Login
                </MotionLink>{" "}
                to register for the session
              </h1>
            </div>
          )}
        </motion.div>
        
        {
          hasSession ? 
          hasStudentOnboardingData && role === "student" ? (
            <motion.div className="flex justify-center animate-bounce"  onClick={() => {
                    const el = document.getElementById("bookingForm");
                    if (el) {
                      el.scrollIntoView({ behavior: "smooth" });
                    }
                  }}>
          <ArrowDownIcon className="rounded-full bg-emerald-300 p-1"/>
        </motion.div>
          ):<motion.div onClickCapture={()=> router.push("/")} className="flex justify-center animate-bounce"  onClick={() => {
                    const el = document.getElementById("bookingForm");
                    if (el) {
                      el.scrollIntoView({ behavior: "smooth" });
                    }
                  }}>
          <HomeIcon className="rounded-full bg-emerald-300 p-1"/>
        </motion.div> : <motion.div onClickCapture={()=> router.push("/")} className="flex justify-center animate-bounce"  onClick={() => {
                    const el = document.getElementById("bookingForm");
                    if (el) {
                      el.scrollIntoView({ behavior: "smooth" });
                    }
                  }}>
          <HomeIcon className="rounded-full bg-emerald-300 p-1"/>
        </motion.div>
        }
        

       
      </div>
    {studentProfileRecord &&
        hasStudentOnboardingData &&
        role === "student" && (
          <div id="bookingForm">
            <SessionForm
              studentProfileRecord={studentProfileRecord}
              sessionRecord={sessionRecord ?? null}
            />
          </div>
        )}
    

      

      {/* <UpcomingSession /> */}
    </>
  );
}
