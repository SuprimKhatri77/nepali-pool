"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Building2, MapPin } from "lucide-react";
import SearchBarSchool from "./SearchBarSchool";
import { SchoolSelectType } from "../../../lib/db/schema";

export default function HeroSection({ total, schools }:{total: number, schools: SchoolSelectType[]}) {
  return (
    <>
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="border-b border-emerald-100 bg-gradient-to-b from-emerald-50/50 to-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center space-y-4">
          {/* Badge animation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <Badge
              variant="outline"
              className="border-emerald-200 text-emerald-700 bg-emerald-50/50"
            >
              <GraduationCap className="w-3 h-3 mr-1" />
              Education Directory
            </Badge>
          </motion.div>

          {/* Heading animation */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900"
          >
            Discover Schools
          </motion.h1>

          {/* Paragraph animation */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7 }}
            className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed"
          >
            Explore our comprehensive directory of educational institutions
            across Japan. Find the perfect school for your educational journey.
          </motion.p>

          {/* Stats animation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.7 }}
            className="flex items-center justify-center gap-6 pt-4 text-sm text-slate-500"
          >
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-600" />
              <span>{total} Schools</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-slate-300" />
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>All Prefectures</span>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
      <SearchBarSchool schools={schools} />
    </>
  );
}
