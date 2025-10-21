"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import UpcomingSession from "@/components/sessions/UpcomingSession";
import SessionForm from "@/components/sessions/Form";
import { StudentProfileSelectType, UserSelectType } from "../../../lib/db/schema";

export default function SessionLandingPage({studentProfileRecord}:{studentProfileRecord: StudentProfileSelectType & {user: UserSelectType}}) {
 

    return (
   <>
    <div className="relative min-h-screen w-full bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center px-6 py-16">
      
      {/* Animated Heading */}
      <motion.h1
        className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 text-center mb-6"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        Connect with Professional Mentors
      </motion.h1>

      {/* Description */}
      <motion.p
        className="max-w-3xl text-center text-lg sm:text-xl text-gray-700 mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        Our platform helps students connect with verified mentors for group sessions.
        Currently, all sessions are private, weekly or bi-weekly. Students pay mentors directly,
        But for now each session are free,
        and we never charge any fees. Grow your skills with guidance from experts!
      </motion.p>

      {/* Session Card */}
      <motion.div
        className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full flex flex-col items-center gap-6"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        <h2 className="text-2xl font-semibold text-gray-900">Weekly Mentorship Session</h2>
        <p className="text-gray-700 text-center">
          Join a personalized 1:1 session with a mentor. Sessions are designed to help you achieve
          your goals faster. Pay the mentor directly, access tips, and grow confidently.
        </p>

        <div className="flex gap-4 mt-4">
          <Button 
          onClick={() => {
    const el = document.getElementById("bookingForm");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }}
          className="bg-emerald-500 hover:bg-emerald-600 text-white">
            Book a Session
          </Button>
          <Button variant="outline">Learn More</Button>
        </div>
      </motion.div>

      {/* Animated Background Elements */}
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
        transition={{ duration: 2, repeat: Infinity, repeatType: "mirror", delay: 1 }}
      />
    </div>
    <div id="bookingForm">

    <SessionForm studentProfileRecord={studentProfileRecord} />
</div>

    {/* <UpcomingSession /> */}
    </>
    
  );
}