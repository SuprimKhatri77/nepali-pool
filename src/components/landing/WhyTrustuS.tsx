"use client"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel";
import {motion } from "framer-motion"
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
    <section className="py-20 px-6 ">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Trust Points */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Why Trust Us?
            </h2>
            <div className="w-20 h-1 bg-emerald-600 rounded-full mb-8"></div>

            <div className="space-y-4">
              {trustPoints.map((point, index) => (
                <div  key={index} className="flex items-start gap-3">
                  <div className="mt-1 flex-shrink-0">
                    <svg
                      className="w-5 h-5 text-emerald-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <p className=" sm:pr-12">{point}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonials */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Testimonials
            </h2>
            <div className="w-20 h-1 bg-emerald-600 rounded-full mb-8"></div>

            <div className="space-y-6 max-w-[290px] sm:max-w-[800px] w-full pl-6 sm:pl-0">
              <Carousel className="sm:max-w-xs xl:max-w-full w-full mx-auto">
                <CarouselContent>
              {testimonials.map((testimonial, index) => (
                  <CarouselItem key={index}>

                <motion.div
                  className="border-emerald-900 rounded-xl p-6 border bg-emerald-300/30"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {testimonial.name}
                      </p>
                      <p className="text-sm text-emerald-700">
                        Verified Student
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm  text-justify">
                    {testimonial.text}
                  </p>
                </motion.div>
                  </CarouselItem>
              ))}

                </CarouselContent>
                <CarouselPrevious className="bg-emerald-300/30"></CarouselPrevious>
                <CarouselNext className="bg-emerald-300/30"></CarouselNext>
              </Carousel>

              {/* /updating carousel section */}

              {/* <Carousel className="max-w-[290px] sm:max-w-[800px] w-full flex items-start justify-start  mx-auto">
                <CarouselContent className="my-auto  flex items-start h-[400px]">
              {testimonials.map((testimonial, index) => (
                  <CarouselItem key={index}>

                <motion.div
                  whileHover={{scale:1.02}} transition={{duration: 0.2, ease: "easeIn"}}
                  className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-6 h-[300px] border border-emerald-200"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {testimonial.name}
                      </p>
                      <p className="text-sm text-emerald-700">
                        Verified Student
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {testimonial.text}
                  </p>
                </motion.div>
                  </CarouselItem>
              ))}

                </CarouselContent>
                <CarouselPrevious></CarouselPrevious>
                <CarouselNext></CarouselNext>
              </Carousel> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
