"use client";

import { StudentCardSkeleton } from "@/modules/connect-student/student-card-skeleton";
import { GraduationCap } from "lucide-react";
import { motion } from "framer-motion";

export default function Loading({ count = 30 }) {
  return (
    <div className="pt-12 max-w-7xl mx-auto">
      <div className="text-center mb-12 sm:mb-16 space-y-4 min-h-1/2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full mb-4">
          <GraduationCap className="w-4 h-4 text-emerald-600" />
          <div className="text-xs sm:text-sm font-medium text-emerald-700">
            Meet with your new friends
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight px-4">
          Find Your Future{" "}
          <motion.span
            initial={{ width: "0ch" }}
            animate={{ width: ["0ch", "22ch"] }}
            transition={{ duration: 11, ease: "linear" }}
            className="hidden text-emerald-700 overflow-hidden text-nowrap sm:inline-flex"
          >
            Roommates & Classmates.
          </motion.span>
          <span className="sm:hidden text-emerald-700">Friends</span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed px-4">
          Connect with future classmates heading to your city. Find peers at
          your university, coordinate travel plans, and start building your
          community before you even step off the plane.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
        {Array.from({ length: count }).map((_, i) => (
          <StudentCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
