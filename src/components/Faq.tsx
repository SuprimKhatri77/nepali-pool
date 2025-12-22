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
import { usePathname } from "next/navigation";

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
        "NepaliPool is a student connection and mentorship platform that helps Nepali students connect with mentors and fellow students applying to study abroad.",
    },
    {
      id: "faq-2",
      question: "How does NepaliPool work?",
      answer:
        "Students can connect with mentors and other students applying to the same country or city. After completing basic profile details, they can start one-on-one chats to share experiences, guidance, and application-related insights.",
    },
    {
      id: "faq-3",
      question: "Who can become a mentor on NepaliPool?",
      answer:
        "Students or graduates who are studying or have studied abroad can apply to become mentors and share their real-life experiences and guidance with other students.",
    },
    {
      id: "faq-4",
      question: "Is NepaliPool free to use?",
      answer:
        "Creating a student account, connecting with other students, and starting chats is free. Some mentors may charge a fee for dedicated one-on-one mentorship sessions.",
    },
  ],
}: Faq1Props) => {
  const displayedItems = items.slice(0, 4);

  const pathname = usePathname();

  return (
    <section className="relative py-24 w-full px-6 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-white via-green-50/40 to-white" />

      <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b98110_1px,transparent_1px),linear-gradient(to_bottom,#10b98110_1px,transparent_1px)] bg-[size:48px_48px]" />

      <div className="container max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
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

        <motion.div>
          <Accordion type="single" collapsible className="space-y-4">
            {displayedItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
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

        {pathname !== "/faq" && (
          <motion.div className="flex justify-center mt-12">
            <Link
              href="/faq"
              className="group inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-emerald-600 text-emerald-600 font-semibold rounded-lg hover:bg-emerald-600 hover:text-white transition-all duration-300 shadow-md hover:shadow-lg"
            >
              View all FAQs
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </motion.div>
        )}

        <motion.div className="text-center mt-8">
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
