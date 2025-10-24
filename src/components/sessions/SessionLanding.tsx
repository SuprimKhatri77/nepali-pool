"use client";

import { easeInOut, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import SessionForm from "@/components/sessions/Form";
import {
  MeetingSessionSelectType,
  StudentProfileSelectType,
  UserSelectType,
} from "../../../lib/db/schema";
import Image from "next/image";
import { ArrowDown } from "lucide-react";

export default function SessionLandingPage({
  studentProfileRecord,
  sessionRecord,
}: {
  studentProfileRecord: StudentProfileSelectType & { user: UserSelectType };
  sessionRecord: MeetingSessionSelectType | null;
}) {
  return (
    <>
     <section
  id="LearnMore"
  className="bg-white min-h-screen text-black py-16 px-6 md:px-12"
>
  <div className="max-w-5xl mx-auto text-center">
    <h2 className="text-3xl md:text-4xl font-bold mb-6">
      🎓 Learn From Real Experiences Abroad
    </h2>

    <p className="text-gray-700 max-w-2xl mx-auto mb-10">
      Join our exclusive online session hosted by{" "}
      <span className="font-semibold">Bigyan Lama</span>, a popular student
      creator living in <span className="font-semibold">Japan</span>. Get real
      insights about studying, living, and adapting abroad — beyond what
      consultancies tell you.
    </p>

    <div className="grid md:grid-cols-2 gap-10 items-center">
      {/* Left Side - Session Details */}
      <div className="text-left space-y-4">
        <h3 className="text-2xl font-semibold">What You’ll Learn</h3>
        <ul className="space-y-2 text-gray-700 list-disc list-inside">
          <li>✅ How to choose the right university and course</li>
          <li>✅ Cost of living, part-time jobs, and budgeting tips</li>
          <li>✅ Common mistakes Nepali students make abroad</li>
          <li>✅ Real visa & documentation experience</li>
        </ul>

      </div>

      {/* Right Side - YouTuber Image + Stats */}
      <div className="space-y-6">
       {/* Host Info */}
  <div className="flex items-center gap-4 text-left">
    <Image
      width={120}
      height={120}
      src="https://yt3.googleusercontent.com/AgHRTctkokHk0TyCz9-g2Eczv6HL949n050Id0muKqmTDqTILN15ttI9WPqHLgw-vJHmhKdsADo=s160-c-k-c0x00ffffff-no-rj"
      alt="Bigyan Lama"
      className="rounded-full object-cover border-4 border-emerald-400"
    />
    <div>
      <h3 className="text-2xl font-semibold">Bigyan Lama</h3>
      <p className="text-gray-600 text-sm">🎓 Student Creator in Japan</p>
      <p className="text-gray-700 text-sm mt-1">
        Sharing real experiences about studying & living abroad.
      </p>
    </div>
  </div>


        {/* Host Stats */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-gray-50 rounded-xl p-4 shadow-sm">
            <h4 className="text-2xl font-bold text-emerald-500">13K+</h4>
            <p className="text-sm text-gray-600">Subscribers</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 shadow-sm">
            <h4 className="text-2xl font-bold text-emerald-500">300+</h4>
            <p className="text-sm text-gray-600">Students Guided</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 shadow-sm">
            <h4 className="text-2xl font-bold text-emerald-500">4+</h4>
            <p className="text-sm text-gray-600">Years Abroad</p>
          </div>
        </div>
      </div>
    </div>
    
        <div onClick={() => {
            const el = document.getElementById("bookingForm");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }} className="relative">
          <Button
          
          className="mt-12 bg-emerald-400 hover:bg-emerald-500 text-white font-semibold px-6 py-3  transition-all"
        >
          Join the Session
        </Button>
        <div className="absolute left-1/2 -translate-x-1/2 -bottom-6">
  <motion.div
    initial={{ y: 6 }}
    animate={{ y: 0 }}
    transition={{
      duration: 0.6,
      ease: "easeInOut",
      repeat: Infinity,
      repeatType: "reverse", // bounce back and forth
    }}
    className="flex items-center justify-center"
  >
    <ArrowDown className="w-6 h-6 text-emerald-500" />
  </motion.div>
</div>

        </div>
  </div>
</section>
      
      <div id="bookingForm">
        <SessionForm
          studentProfileRecord={studentProfileRecord}
          sessionRecord={sessionRecord ?? null}
        />
      </div>

      {/* <div className="relative min-h-screen w-full bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center px-6 py-16">
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
          className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full flex flex-col items-center gap-6"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <h2 className="text-2xl font-semibold text-gray-900">
            Weekly Mentorship Session
          </h2>
          <p className="text-gray-700 text-center">
            Join a personalized 1:1 session with a mentor. Sessions are designed
            to help you achieve your goals faster. Pay the mentor directly,
            access tips, and grow confidently.
          </p>

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
            <Button
            onClick={() => {
                const el = document.getElementById("LearnMore");
                if (el) {
                  el.scrollIntoView({ behavior: "smooth" });
                }
              }}
             variant="outline">Learn More</Button>
          </div>
        </motion.div>

        <motion.div
          className="absolute top-0 left-0 w-64 h-64 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "mirror" }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "mirror",
            delay: 1,
          }}
        />
      </div> */}
      


      {/* <UpcomingSession /> */}
    </>
  );
}
