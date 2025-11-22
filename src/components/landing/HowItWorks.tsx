"use client";
import HowItWorksCard from "./resuable/HITWcard";
import { motion } from "framer-motion";

export default function HowItWorks() {
  const steps = [
    {
      img: "/landing/how1.png",
      Header: "Visit NepaliPool.Com",
      Content:
        "Create your account and explore our mentors who are already in Japan.",
    },
    {
      img: "/landing/how2.png",
      Header: "Choose Support Option",
      Content: "Search the mentor based on the place you are trying to apply."
    },
    {
      img: "/landing/how3.png",
      Header: "Get Guidance",
      Content:
        "The mentor will help you to get knowledge about the choosen school or area.",
    },
    {
      img: "/landing/how4.png",
      Header: "Join Session",
      Content: "Join session where you can question 4+ years experience mentor in Japan.",
    },
    {
      img: "/landing/how5.png",
      Header: "Fly & Become a Mentor",
      Content:
        "Start your journey and help future students with your experience.",
    },
  ];

  return (
    <motion.section
      className="relative py-20 px-6 overflow-hidden"
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-emerald-50/40 to-white" />

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b98115_1px,transparent_1px),linear-gradient(to_bottom,#10b98115_1px,transparent_1px)] bg-[size:40px_40px]" />


    

      <div className="max-w-7xl mx-auto relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-3">
          How It Works
        </h2>
        <div className="w-20 h-1 bg-gradient-to-r from-emerald-500 to-green-600 mx-auto rounded-full mb-12"></div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {steps.map((step, index) => (
            <HowItWorksCard key={index} {...step} step={index + 1} />
          ))}
        </div>
      </div>
    </motion.section>
  );
}
