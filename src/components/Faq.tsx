"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

interface Faq1Props {
  heading?: string;
  items?: FaqItem[];
}

const Faq1 = ({
  heading = "Frequently asked questions",
  items = [
    {
      id: "faq-1",
      question: "What is NepaliPool?",
      answer:
        "NepaliPool is a mentorship platform that connects Nepali students with experienced mentors who have already studied abroad.",
    },
    {
      id: "faq-2",
      question: "How does NepaliPool work?",
      answer:
        "Students can browse verified mentors based on country, course, or university. Once matched, they can book a one-on-one session to discuss study plans, visa guidance, lifestyle abroad, and career opportunities.",
    },
    {
      id: "faq-3",
      question: "Who can become a mentor on NepaliPool?",
      answer:
        "Anyone who has studied or is currently studying abroad can apply to become a mentor. Mentors share their real experiences and guide students through the process of studying overseas.",
    },
    {
      id: "faq-4",
      question: "Is NepaliPool free to use?",
      answer:
        "Creating a student account and browsing mentors is completely free. However, booking a one-on-one session with a mentor may have a small fee, which goes directly to the mentor for their time and support.",
    },
  ],
}: Faq1Props) => {
  // Show only first 4 items
  const displayedItems = items.slice(0, 4);

  return (
    <section className="relative py-24 w-full px-6 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-green-50/40 to-white" />

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b98110_1px,transparent_1px),linear-gradient(to_bottom,#10b98110_1px,transparent_1px)] bg-[size:48px_48px]" />

      {/* Decorative Elements */}
      {/* <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/4 right-10 w-96 h-96 bg-emerald-300/20 rounded-full blur-3xl"
      /> */}
      {/* <motion.div
        initial={{scale: [1,1,1]}}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-1/4 left-10 w-96 h-96 bg-green-300/15 rounded-full blur-3xl"
      /> */}

      <div className="container max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {heading}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to know about NepaliPool
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div
          
        >
          <Accordion type="single" collapsible className="space-y-4">
            {displayedItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, }}
                whileInView={{ opacity: 1,  }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <AccordionItem
                  value={`item-${item.id}`}
                  className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl px-6 py-2 hover:border-emerald-300 hover:shadow-lg transition-all duration-300"
                >
                  <AccordionTrigger className="font-semibold text-base text-left text-gray-900 hover:text-emerald-600 hover:no-underline py-4">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 leading-relaxed pb-4">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>

        {/* View All Link */}
        <motion.div
          // initial={{ opacity: 0, y: 20 }}
          // whileInView={{ opacity: 1, y: 0 }}
          // transition={{ duration: 0.6, delay: 0.4 }}
          className="flex justify-center mt-12"
        >
          <Link
            href="/faq"
            className="group inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-emerald-600 text-emerald-600 font-semibold rounded-lg hover:bg-emerald-600 hover:text-white transition-all duration-300 shadow-md hover:shadow-lg"
          >
            View all FAQs
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </motion.div>

        {/* Optional: Still have questions CTA */}
        <motion.div
          // initial={{ opacity: 0 }}
          // whileInView={{ opacity: 1 }}
          // transition={{ duration: 0.6 }}
          className="text-center mt-8"
        >
          <p className="text-gray-600">
            Still have questions?{" "}
            <Link
              href="/support"
              className="text-emerald-600 font-medium hover:text-emerald-700 underline underline-offset-4"
            >
              Contact our support team
            </Link>
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export { Faq1 };
