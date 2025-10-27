"use client"
import Link from 'next/link'
import React from 'react'
import { motion } from 'framer-motion'
const MotionLink = motion(Link)

export default function OurFeature() {
  return (
    <section className="bg-white py-20 px-6">
  <div className="max-w-6xl mx-auto text-center mb-12">
    <h2 className="text-4xl font-bold mb-4 text-black">What We Offer</h2>
    <p className="text-lg text-gray-700">
      Personalized guidance to help you achieve your study abroad goals.
    </p>
  </div>

  <motion.div whileHover={{scale:1.06}} transition={{duration: 0.5, ease: "linear"}} className="max-w-6xl mx-auto grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {/* 1: One-to-One Chat */}
    <motion.div 
        whileHover={{scale:0.9}} transition={{duration: 0.5, ease: "easeInOut"}}
    
    className="border rounded-xl p-8 shadow-md hover:shadow-xl  flex flex-col items-center text-center">
      <div className="mb-6">
        {/* Icon: chat bubble */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 text-emerald-500 mx-auto"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.77 9.77 0 01-4.917-1.373L3 20l1.373-4.083A9.77 9.77 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      </div>
      <h3 className="text-2xl font-semibold mb-4">One-to-One Chat</h3>
      <p className="text-gray-700 mb-6">
        Get personal guidance from mentors who are already studying abroad.
      </p>
      <MotionLink 
        href="/mentors"
        className="bg-emerald-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-600 transition"
      >
        Connect with Mentor
      </MotionLink>
    </motion.div>

    {/* 2: Group Sessions */}
    <motion.div
    whileHover={{scale:0.9}} transition={{duration: 0.5, ease: "easeInOut"}}
    className="border rounded-xl p-8 shadow-md hover:shadow-xl  flex flex-col items-center text-center">
      <div className="mb-6">
        {/* Icon: group */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 text-emerald-500 mx-auto"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17 20h5v-2a4 4 0 00-4-4h-1M9 20H4v-2a4 4 0 014-4h1M12 12a4 4 0 100-8 4 4 0 000 8z"
          />
        </svg>
      </div>
      <h3 className="text-2xl font-semibold mb-4">Weekly Group Sessions</h3>
      <p className="text-gray-700 mb-6">
        Join interactive weekly sessions led by experienced mentors to learn together.
      </p>
      <Link
        href="/sessions"
        className="bg-emerald-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-600 transition"
      >
        Check Sessions
      </Link>
    </motion.div>

    {/* 3: Mentors */}
    <motion.div 
    whileHover={{scale:0.9}} transition={{duration: 0.5, ease: "easeInOut"}}
    className="border rounded-xl p-8 shadow-md hover:shadow-xl  flex flex-col items-center text-center">
      <div className="mb-6">
        {/* Icon: user */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 text-emerald-500 mx-auto"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5.121 17.804A4.992 4.992 0 0112 15c1.657 0 3.156.81 4.121 2.045M12 12a4 4 0 100-8 4 4 0 000 8z"
          />
        </svg>
      </div>
      <h3 className="text-2xl font-semibold mb-4">Explore Mentors</h3>
      <p className="text-gray-700 mb-6">
        Browse mentors who have studied abroad and find the right guidance for you.
      </p>
      <Link
        href="/mentors"
        className="bg-emerald-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-600 transition"
      >
        View Mentors
      </Link>
    </motion.div>
  </motion.div>
</section>
  )
}
