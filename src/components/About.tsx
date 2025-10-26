"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-green-50 text-gray-900">
      <section className="py-20 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-extrabold text-gray-900"
        >
          About <span className="text-green-600">NepaliPool</span>
        </motion.h1>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          Empowering Nepali students to connect with real mentors, gain clarity,
          and make confident study-abroad decisions.
        </p>
      </section>

      <section className="py-16 bg-white border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Our <span className="text-green-600">Mission</span>
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
            At <span className="font-semibold">NepaliPool</span>, our mission is
            to guide Nepali students through every step of their study-abroad
            journey &mdash; from choosing the right country and university to
            connecting with mentors who have firsthand experience. We believe
            every student deserves honest advice, practical insight, and the
            right support to achieve their dreams.
          </p>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-green-50 to-white">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-10 text-center">
          <div className="p-8 bg-white rounded-2xl shadow-md border border-gray-100">
            <h3 className="text-2xl font-semibold text-green-700 mb-3">
              Mentor Connection
            </h3>
            <p className="text-gray-600">
              Connect directly with mentors who studied abroad &mdash; get
              genuine insights about life, study, and career paths in your dream
              country.
            </p>
          </div>

          <div className="p-8 bg-white rounded-2xl shadow-md border border-gray-100">
            <h3 className="text-2xl font-semibold text-green-700 mb-3">
              School Recommendations
            </h3>
            <p className="text-gray-600">
              Discover trusted universities and programs verified by real
              students, not agents. Make smarter choices for your future.
            </p>
          </div>

          <div className="p-8 bg-white rounded-2xl shadow-md border border-gray-100">
            <h3 className="text-2xl font-semibold text-green-700 mb-3">
              Personalized Guidance
            </h3>
            <p className="text-gray-600">
              We match you with mentors who align with your goals, budget, and
              academic background for a truly tailored experience.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Our <span className="text-green-600">Story</span>
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
            NepaliPool was founded by a group of Nepali students who once
            struggled with the same questions you might have today &mdash;
            &ldquo;Which country should I choose?&rdquo;, &ldquo;How much will it
            cost?&rdquo;, &ldquo;Can I manage studies and part-time
            work?&rdquo;. We turned those challenges into a community where
            experience meets empathy.
          </p>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-green-600 to-green-500 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">
          Join the <span className="text-white/90">NepaliPool</span> Community
        </h2>
        <p className="text-lg mb-8 text-white/90 max-w-xl mx-auto">
          Whether you&apos;re a student dreaming big or a mentor ready to give
          back, NepaliPool is your platform to connect, guide, and grow
          together.
        </p>
        <div className="flex justify-center gap-4">
          <Button className="bg-white text-green-600 hover:bg-green-50 font-semibold px-6 py-3 rounded-xl">
            <Link href={"/sign-up?role=student"}>Start as a Student</Link>
          </Button>
          <Button className="bg-green-700 text-white hover:bg-green-800 font-semibold px-6 py-3 rounded-xl">
            <Link href={"/sign-up?role=mentor"}>Become a Mentor</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
