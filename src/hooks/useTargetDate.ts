import { useState, useEffect } from "react";

/**
 * useTargetDate
 * @param targetDateISO ISO string of target date, e.g., "2025-11-07T17:00:00+05:45"
 * @returns boolean — true if current time >= target date, false otherwise
 */
export function useTargetDate(targetDateISO: string) {
  const [isReached, setIsReached] = useState(false);

  useEffect(() => {
    const targetTime = new Date(targetDateISO).getTime();

    const checkTime = () => {
      const now = Date.now();
      setIsReached(now >= targetTime);
    };

    // Initial check
    checkTime();

    // Optional: keep checking every second
    const interval = setInterval(checkTime, 1000);

    return () => clearInterval(interval);
  }, [targetDateISO]);

  return isReached;
}
