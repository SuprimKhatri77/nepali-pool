"use client";
type Props = { img: string; Header: string; Content: string; step: number };
import { motion } from "framer-motion";

export default function HowItWorksCard({ Header, Content, step }: Props) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      transition={{ duration: 0.3 }}
      className="relative group"
    >
      {/* Glow Effect on Hover */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl opacity-0 group-hover:opacity-20 blur transition-opacity duration-300" />

      <div className="relative bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl p-6 hover:border-emerald-300 hover:shadow-xl transition-all duration-300 max-w-xs h-full">
        {/* Step Number Badge */}
        <div className="relative mb-4">
          <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-xl">{step}</span>
          </div>

          {/* Decorative ring */}
          <div className="absolute inset-0 w-14 h-14 border-2 border-emerald-200 rounded-xl animate-pulse" />
        </div>

        {/* Content */}
        <h3 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-emerald-600 transition-colors">
          {Header}
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed">{Content}</p>

        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-green-600 rounded-b-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    </motion.div>
  );
}
