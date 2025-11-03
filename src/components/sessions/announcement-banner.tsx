"use client";

import React, { useEffect, useState } from "react";
import { X, Calendar, Clock } from "lucide-react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { getCurrentUserMeetingData } from "../../../server/lib/dal/get-current-user-meeting-record";
import { MeetingSessionSelectType } from "../../../lib/db/schema";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";

export default function AnnouncementBanner({
  isVisible,
  setIsVisible,
}: {
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const [meetingData, setMeetingData] =
    useState<MeetingSessionSelectType | null>(null);
  useEffect(() => {
    const fetchUserMeetingData = async () => {
      setLoading(true);
      const result = await getCurrentUserMeetingData();
      console.log("result ab: ", result);
      if (result.success && result.meetingRecord) {
        setMeetingData(result.meetingRecord);
      } else {
        setMeetingData(null);
      }

      setLoading(false);
    };
    fetchUserMeetingData();
  }, []);
  useEffect(() => {
    if (isVisible) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [isVisible]);

  if (!isVisible) return null;
  console.log("meeting record: ", meetingData);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          id="announ"
          key={"announcement"}
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className=" bg-gradient-to-r from-emerald-50 to-green-50 border-b border-emerald-200"
        >
          <div className="max-w-[1350px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-3 sm:py-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                {/* Left Content */}
                <div className="flex items-center gap-3 flex-1 text-center sm:text-left">
                  <div className="hidden sm:flex items-center justify-center w-10 h-10 bg-emerald-500 rounded-full flex-shrink-0">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <div>
                      <span className="text-sm sm:text-base font-semibold text-emerald-900">
                        Upcoming Japan Session
                      </span>
                      <div className="flex items-center justify-center sm:justify-start gap-4 mt-1 text-xs sm:text-sm text-emerald-700">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>November 06, 2025</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>04:00 PM</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {loading ? (
                    <Spinner />
                  ) : meetingData ? (
                    <Button variant="outline">Join session</Button>
                  ) : (
                    <Link
                      href="/sessions"
                      className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
                    >
                      Book Session
                    </Link>
                  )}

                  <button
                    onClick={() => setIsVisible(false)}
                    className="p-1.5 hover:bg-emerald-100 rounded-lg transition-colors duration-200"
                    aria-label="Close announcement"
                  >
                    <X className="w-5 h-5 text-emerald-700" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
