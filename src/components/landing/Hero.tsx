"use client";
import Link from "next/link";
import { authClient } from "../../../server/lib/auth/auth-client";
import { Spinner } from "../ui/spinner";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
const MotionLink = motion(Link);

export default function Hero() {
  const { data: session, isPending } = authClient.useSession();
  const isMobile = useIsMobile();

  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    if (isMobile) {
      setShowCursor(false);
      return;
    }
    const timerId = setTimeout(() => {
      setShowCursor(false);
    }, 8000);
    return () => clearTimeout(timerId);
  }, [isMobile]);

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{duration:0.6, ease: "easeIn"}}
      className="relative overflow-hidden min-h-screen flex items-center justify-center px-4 sm:px-6 pb-20 sm:pb-24"
    >
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-green-50" />

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b98120_1px,transparent_1px),linear-gradient(to_bottom,#10b98120_1px,transparent_1px)] bg-[size:48px_48px]" />

      {/* Radial Gradient Accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-radial from-emerald-100/40 via-transparent to-transparent blur-3xl" />

      {/* Floating Orbs */}
      {/* <motion.div
        animate={{
          y: [0, -20, 0],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-20 left-10 w-72 h-72 bg-emerald-200/30 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          y: [0, 20, 0],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-20 right-10 w-96 h-96 bg-green-200/20 rounded-full blur-3xl"
      /> */}

      {/* Content */}
      <div className="max-w-5xl mx-auto text-center w-full relative z-10">
        <h1 className="text-4xl sm:text-5xl sm:mb-0 mb-12 md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight tracking-tight">
          Your Trusted Mentor to{" "}
          <motion.span
            initial={{ width: "6ch" }}
            animate={{ width: ["6ch", "21ch", "7ch", "21ch"] }}
            transition={{ duration: 8, ease: "linear" }}
            className="hidden sm:inline-block overflow-hidden whitespace-nowrap"
          >
            <span className="block sm:inline">Study </span>
            <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
              Abroad
            </span>{" "}
            <span className="block sm:inline">from </span>
            <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
              Nepal
            </span>
          </motion.span>
          <span className="inline sm:hidden">
            <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
              Study Abroad
            </span>{" "}
            from{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
              Nepal
            </span>
          </span>
          {showCursor && (
            <motion.span
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
              className="inline-block w-[4px] h-[1em] bg-emerald-600 ml-1 align-bottom"
            />
          )}
        </h1>

        <motion.p className="mt-6 sm:mt-8 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Helping Nepali students choose the right college, city, and future —
          with expert guidance from someone who&apos;s been there.
        </motion.p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8 sm:mt-12 w-full max-w-sm sm:max-w-none mx-auto">
          {isPending ? (
            <div className="flex justify-center h-[40px] py-3">
              <Spinner />
            </div>
          ) : !session ? (
            <>
              <MotionLink
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.5 }}
                href="/sign-up?role=mentor"
                className="w-full sm:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors shadow-lg hover:shadow-xl text-base sm:text-lg"
              >
                Start as a Mentor
              </MotionLink>
              <MotionLink
                initial={{ scale: 1 }}
                animate={{ scale: 1.03 }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut",
                }}
                href="/sign-up?role=student"
                className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-gray-50 text-emerald-600 font-semibold rounded-lg transition-colors shadow-lg hover:shadow-xl border-2 border-emerald-600 text-base sm:text-lg"
              >
                Start as a Student
              </MotionLink>
            </>
          ) : (
            <MotionLink
              whileInView={{ scale: 1 }}
              initial={{ scale: 1 }}
              animate={{ scale: 1.03 }}
              transition={{
                duration: 0.5,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
              href="/dashboard"
              className="w-full sm:w-auto px-8 py-4 bg-emerald-50 text-emerald-700 font-semibold rounded-lg hover:bg-emerald-100 transition-colors border-2 border-emerald-400 shadow-lg hover:shadow-xl text-base sm:text-lg"
            >
              Go to Dashboard
            </MotionLink>
          )}
        </div>
      </div>
    </motion.section>
  );
}
