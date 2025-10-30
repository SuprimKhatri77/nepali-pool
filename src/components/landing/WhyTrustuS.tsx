"use client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import { motion } from "framer-motion";

const trustPoints = [
  "Affordable mentorship by real Nepali students who've successfully navigated the process",
  "Verified mentors with proven track records of successful applications",
  "Comprehensive guidance from application to arrival in Japan",
  "24/7 support system for all your questions and concerns",
  "Transparent pricing with no hidden fees or charges",
];

const testimonials = [
  {
    name: "Roshan Pokharel",
    text: "I was skeptical at first, but the mentorship program turned out to be a game-changer. The guidance and support I received were invaluable, and I'm grateful for the opportunity to learn from someone who's been there.",
  },
  {
    name: "Bhupendra Thapa",
    text: "The mentor assigned to me understood exactly what I was going through. Their firsthand experience made all the difference in my application success.",
  },
];

export default function WhyTrustUs() {
  return (
    <section className="relative py-20 px-6 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-emerald-50/50 to-white" />

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b98112_1px,transparent_1px),linear-gradient(to_bottom,#10b98112_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* Decorative Blobs */}
      <motion.div
        animate={{
          x: [0, 30, 0],
          y: [0, -30, 0],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/4 left-0 w-96 h-96 bg-emerald-300/20 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          x: [0, -30, 0],
          y: [0, 30, 0],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-1/4 right-0 w-96 h-96 bg-green-300/20 rounded-full blur-3xl"
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
          {/* Trust Points */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Why Trust Us?
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full mb-8"></div>

            <div className="space-y-4">
              {trustPoints.map((point, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-start gap-3 group"
                >
                  <div className="mt-1 flex-shrink-0">
                    <div className="w-6 h-6 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{point}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Testimonials */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Testimonials
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full mb-8"></div>

            <div className="max-w-full">
              <Carousel className="w-full">
                <CarouselContent>
                  {testimonials.map((testimonial, index) => (
                    <CarouselItem key={index}>
                      <div className="relative group">
                        {/* Glow Effect */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500" />

                        <div className="relative bg-white/90 backdrop-blur-sm border border-gray-200 rounded-2xl p-8 hover:border-emerald-300 hover:shadow-xl transition-all duration-300">
                          {/* Quote Icon */}
                          <div className="absolute top-6 right-6 opacity-10">
                            <svg
                              className="w-16 h-16 text-emerald-600"
                              fill="currentColor"
                              viewBox="0 0 32 32"
                            >
                              <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                            </svg>
                          </div>

                          {/* User Info */}
                          <div className="flex items-center gap-4 mb-6">
                            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                              {testimonial.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 text-lg">
                                {testimonial.name}
                              </p>
                              <p className="text-sm text-emerald-600 font-medium">
                                Verified Student
                              </p>
                            </div>
                          </div>

                          {/* Testimonial Text */}
                          <p className="text-gray-700 leading-relaxed relative z-10">
                            &quot;{testimonial.text}&quot;
                          </p>

                          {/* Star Rating */}
                          <div className="flex gap-1 mt-6">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className="w-5 h-5 text-yellow-400"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="bg-white/90 backdrop-blur-sm border-gray-200 hover:bg-emerald-50 hover:border-emerald-300 -left-4" />
                <CarouselNext className="bg-white/90 backdrop-blur-sm border-gray-200 hover:bg-emerald-50 hover:border-emerald-300 -right-4" />
              </Carousel>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
