"use client"
import HowItWorksCard from "./resuable/HITWcard";
import { motion} from "framer-motion"


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
    <motion.section initial={{opacity: 0}} whileInView={{opacity:1}} transition={{duration: 0.8}} className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-3">
          How It Works
        </h2>
        <div className="w-20 h-1 bg-emerald-600 mx-auto rounded-full mb-12"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {steps.map((step, index) => (
            <HowItWorksCard key={index} {...step} step={index + 1} />
          ))}
        </div>
      </div>
    </motion.section>
  );
}
