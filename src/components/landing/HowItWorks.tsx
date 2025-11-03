"use client";
import HowItWorksCard from "./resuable/HITWcard";
import { motion } from "framer-motion";

export default function HowItWorks() {
  const steps = [
    {
      img: "/landing/how1.png",
      Header: "Visit NepaliPool.Com",
      Content:
        "Create your account and explore our partner schools in Japan and Korea.",
    },
    {
      img: "/landing/how2.png",
      Header: "Choose Support Option",
      Content: "Select from free resources or premium mentorship packages.",
    },
    {
      img: "/landing/how3.png",
      Header: "Submit Application",
      Content:
        "We help you complete all documents and submit to your chosen schools.",
    },
    {
      img: "/landing/how4.png",
      Header: "Get Offer Letter & Visa",
      Content: "Receive acceptance and we guide you through the visa process.",
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeIn" }}
      className="relative py-20 px-6 overflow-hidden"
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-emerald-50/40 to-white" />

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b98115_1px,transparent_1px),linear-gradient(to_bottom,#10b98115_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* Decorative Blob Top */}
      {/* <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.4, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl"
      /> */}

      {/* Decorative Blob Bottom */}
      {/* <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-0 left-1/4 w-96 h-96 bg-green-200/20 rounded-full blur-3xl"
      /> */}

      <div className="max-w-7xl mx-auto relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-3">
          How It Works
        </h2>
        <div className="w-20 h-1 bg-gradient-to-r from-emerald-500 to-green-600 mx-auto rounded-full mb-12"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {steps.map((step, index) => (
            <HowItWorksCard key={index} {...step} step={index + 1} />
          ))}
        </div>
      </div>
    </motion.section>
  );
}
