"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function AnnouncementBannerTimer({
  targetDate,
}: {
  targetDate: string;
}) {
  const calculateTimeLeft = () => {
    const difference = new Date(targetDate).getTime() - Date.now();

    let timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
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

  // Dynamically show days only if more than 0
  const units =
    timeLeft.days > 0
      ? ["days", "hours", "minutes", "seconds"]
      : ["hours", "minutes", "seconds"];

  return (
 <div className="flex items-center justify-center gap-3 bg-emerald-50 text-emerald-700 text-sm font-semibold h-[38px] px-3">
  <span className="text-gray-700 mr-1">Session starts in:</span>
  
  <div className="flex items-end gap-2">
    {units.map((unit) => (
      <div key={unit} className="flex flex-col items-center leading-none">
        <AnimatePresence mode="popLayout">
          <motion.span
            suppressHydrationWarning
            key={(timeLeft as any)[unit]}
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 10, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="tabular-nums text-sm font-mono"
          >
            {(timeLeft as any)[unit].toString().padStart(2, "0")}
          </motion.span>
        </AnimatePresence>
        <span className="text-[10px] text-gray-500">
          {unit.charAt(0).toUpperCase()}
        </span>
      </div>
    ))}
  </div>
</div>


  );
}
