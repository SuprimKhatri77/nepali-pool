"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import HeroButtons from "./hero-buttons";

export default function Hero() {
  const isMobile = useIsMobile();

  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    if (isMobile) {
      setTimeout(() => {
        setShowCursor(false)
      }, 0);
      return;
    }
    const timerId = setTimeout(() => {
      setShowCursor(false);
    }, 8000);
    return () => clearTimeout(timerId);
  }, [isMobile]);

  return (
    <section
    
      className="relative overflow-hidden min-h-screen flex items-center justify-center px-4 sm:px-6 pb-20 sm:pb-24"
    >
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-green-50" />

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b98120_1px,transparent_1px),linear-gradient(to_bottom,#10b98120_1px,transparent_1px)] bg-[size:48px_48px]" />

      {/* Radial Gradient Accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-radial from-emerald-100/40 via-transparent to-transparent blur-3xl" />


      {/* Content */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{duration:0.4, ease: "easeIn"}}
      className="max-w-5xl mx-auto text-center w-full relative z-10">
        <h1 className="text-4xl sm:text-5xl sm:mb-0 mb-12 md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight tracking-tight">
          Your Trusted Mentor to{" "}
          <motion.span
            initial={{ width: "7ch" }}
            animate={{ width: ["7ch", "21ch", "7ch", "21ch"] }}
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
              className="hidden sm:inline-block w-[4px] h-[1em] bg-emerald-600 ml-1 align-bottom "
            />
          )}
        </h1>

        <p className="mt-6 sm:mt-8 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Helping Nepali students choose the right college, city, and future —
          with expert guidance from someone who&apos;s been there.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8 sm:mt-12 w-full max-w-sm sm:max-w-none mx-auto">
          <HeroButtons />
          {/* NOTE */}
        </div>
      </motion.div>
    </section>
  );
}
