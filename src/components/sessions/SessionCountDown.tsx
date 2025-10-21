"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function SessionCountdown({ targetDate }: { targetDate: string }) {
  const calculateTimeLeft = () => {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft = { hours: 0, minutes: 0, seconds: 0 };

    if (difference > 0) {
      timeLeft = {
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center mt-6">
      <h3 className="text-lg text-gray-600 mb-2 font-medium">⏳ Session starts in</h3>
      <div className="flex gap-4 text-4xl font-bold text-emerald-600">
        {["hours", "minutes", "seconds"].map((unit) => (
          <AnimatePresence mode="popLayout" key={unit}>
            <motion.span
              key={(timeLeft as any)[unit]}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="tabular-nums min-w-[60px] text-center"
            >
              {(timeLeft as any)[unit].toString().padStart(2, "0")}
            </motion.span>
          </AnimatePresence>
        ))}
      </div>
      <div className="flex gap-6 text-sm text-gray-500 mt-1">
        <span>Hours</span>
        <span>Minutes</span>
        <span>Seconds</span>
      </div>
    </div>
  );
}
