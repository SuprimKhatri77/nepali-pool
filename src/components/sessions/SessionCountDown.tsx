"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useState } from "react";

export type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};


export type TimeUnit = keyof TimeLeft;


export default function SessionCountdown({
  targetDate,
}: {
  targetDate: string;
}) {
const calculateTimeLeft = useCallback(() => {
  const getDate = () => Date.now();
  const difference = new Date(targetDate).getTime() - getDate();

  const timeLeft: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };


  if (difference > 0) {
   const timeLeft: TimeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
    return timeLeft
  }

  return timeLeft;
}, [targetDate]); // dependency: recalc only if targetDate changes

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  // Dynamically show days only if more than 0
  const units: TimeUnit[] =
    timeLeft.days > 0
      ? ["days", "hours", "minutes", "seconds"]
      : ["hours", "minutes", "seconds"];

  return (
    <div className="flex flex-col items-center justify-center mt-6">
      <h3 className="text-lg text-gray-600 mb-2 font-medium">
        ⏳ Session starts in
      </h3>
      <div className="flex gap-4 text-4xl font-bold text-emerald-600">
        {units.map((unit,idx) => (
          <AnimatePresence mode="popLayout" key={unit}>
            <motion.span
              suppressHydrationWarning
              key={idx}
              initial={{  opacity: 0 }}
              animate={{  opacity: 1 }}
              exit={{  opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="tabular-nums min-w-[60px] text-center"
            >
              {timeLeft[unit].toString().padStart(2, "0")}
            </motion.span>
          </AnimatePresence>
        ))}
      </div>
      <div className="flex gap-6 text-sm text-gray-500 mt-1">
        {units.map((unit) => (
          <span key={unit}>{unit.charAt(0).toUpperCase() + unit.slice(1)}</span>
        ))}
      </div>
    </div>
  );
}
