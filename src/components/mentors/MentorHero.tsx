"use client"
import { Sparkles } from 'lucide-react'
import React from 'react'
import { motion } from 'framer-motion'

export default function MentorHero() {
  return (
     <div className="text-center mb-12 sm:mb-16 space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full mb-4">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <div className="text-xs sm:text-sm font-medium text-emerald-700">
                  Connect with Expert Mentors
                </div>
              </div>
    
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight px-4">
                Find Your Perfect <motion.span initial={{width: "0ch"}} animate={{width: ["0ch","7ch"]}} transition={{duration: 3, ease: "linear"}} className="hidden  text-emerald-700  overflow-hidden text-nowrap sm:inline-flex">Mentor</motion.span>
                    <span  className="sm:hidden  text-emerald-700  ">Mentor</span>
              </h1>
    
              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed px-4">
                Browse through our curated list of experienced mentors ready to
                guide you on your journey to success
              </p>
            </div>
  )
}
