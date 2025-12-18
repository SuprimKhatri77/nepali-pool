"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Image from "next/image";

// Placeholder image
const placeholderImg = "https://vbteadl6m3.ufs.sh/f/DDJ5nPL6Yp1sOjASnmoRK8bhzDV6SN54Fks0Uc3GnugvPLEa";

const mentors = [
  { name: "Mentor 1", img: placeholderImg },
  { name: "Mentor 2", img: placeholderImg },
  { name: "Mentor 3", img: placeholderImg },
];

export default function UpcomingSession() {
  return (
    <section className="relative py-16 px-6 bg-gray-50">
      <motion.h2
        className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-12"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Upcoming Group Sessions
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Session Card Example */}
        <motion.div
          className="bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center gap-4"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          {/* Mentor Carousel */}
          <div className="flex gap-2 overflow-x-auto w-full pb-4">
            {mentors.map((mentor, idx) => (
         <Image
  key={idx}
  src={mentor.img}       // can be a string URL
  alt={mentor.name}
  width={64}             // w-16 = 64px
  height={64}            // h-16 = 64px
  className="mx-auto rounded-full border-2 border-emerald-500 object-cover"
/>

            ))}
          </div>

          {/* Session Details */}
          <h3 className="text-xl font-semibold text-gray-900">Nepal Group Session</h3>
          <p className="text-gray-700 text-center">
            Country: Nepal <br />
            Slots: 10/20 <br />
            Date: 25th Oct 2025 <br />
            Time: 4:00 PM - 5:00 PM <br />
            Organizer: Roshan Pokhrel
          </p>

          {/* Meeting Link */}
          <a
            href="https://zoom.us/meetinglink"
            target="_blank"
            className="text-emerald-600 hover:underline font-medium"
          >
            Join Meeting
          </a>

          {/* Action Button */}
          <Button className="bg-emerald-500 hover:bg-emerald-600 text-white mt-2 w-full">
            Book Slot
          </Button>
        </motion.div>

        {/* Duplicate Cards */}
        <motion.div
          className="bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center gap-4"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="flex gap-2 overflow-x-auto w-full pb-4">
            {mentors.map((mentor, idx) => (
              <Image
  key={idx}
  src={mentor.img}       // can be a string URL
  alt={mentor.name}
  width={64}             // w-16 = 64px
  height={64}            // h-16 = 64px
  className="mx-auto rounded-full border-2 border-emerald-500 object-cover"
/>

            ))}
          </div>
          <h3 className="text-xl font-semibold text-gray-900">India Group Session</h3>
          <p className="text-gray-700 text-center">
            Country: India <br />
            Slots: 15/25 <br />
            Date: 27th Oct 2025 <br />
            Time: 5:00 PM - 6:00 PM <br />
            Organizer: Sita Sharma
          </p>
          <a
            href="https://zoom.us/meetinglink"
            target="_blank"
            className="text-emerald-600 hover:underline font-medium"
          >
            Join Meeting
          </a>
          <Button className="bg-emerald-500 hover:bg-emerald-600 text-white mt-2 w-full">
            Book Slot
          </Button>
        </motion.div>

        <motion.div
          className="bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center gap-4"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="flex gap-2 overflow-x-auto w-full pb-4">
            {mentors.map((mentor, idx) => (
             <Image
  key={idx}
  src={mentor.img}       // can be a string URL
  alt={mentor.name}
  width={64}             // w-16 = 64px
  height={64}            // h-16 = 64px
  className="mx-auto rounded-full border-2 border-emerald-500 object-cover"
/>

            ))}
          </div>
          <h3 className="text-xl font-semibold text-gray-900">USA Group Session</h3>
          <p className="text-gray-700 text-center">
            Country: USA <br />
            Slots: 5/15 <br />
            Date: 28th Oct 2025 <br />
            Time: 6:00 PM - 7:00 PM <br />
            Organizer: Ram Thapa
          </p>
          <a
            href="https://zoom.us/meetinglink"
            target="_blank"
            className="text-emerald-600 hover:underline font-medium"
          >
            Join Meeting
          </a>
          <Button className="bg-emerald-500 hover:bg-emerald-600 text-white mt-2 w-full">
            Book Slot
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
